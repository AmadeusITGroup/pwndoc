import { Notify, Dialog, QSpinnerGears} from 'quasar';

import Breadcrumb from 'components/breadcrumb';
import TextareaArray from 'components/textarea-array'
import CustomFields from 'components/custom-fields'

import AuditService from '@/services/audit';
import ClientService from '@/services/client';
import CompanyService from '@/services/company';
import CollabService from '@/services/collaborator';
import ReviewerService from '@/services/reviewer';
import TemplateService from '@/services/template';
import DataService from '@/services/data';
import Utils from '@/services/utils';
import AttachmentService from '@/services/attachment';
import { useI18n } from 'vue-i18n';
import { ref, reactive, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import _ from 'lodash';
import {settings} from '@/boot/settings';
import { socket } from '@/boot/socketio';

export default {
    props: {
        frontEndAuditState: Number,
        parentState: String,
        parentApprovals: Array

    },
    data: () => {
        return {
            // Set audit ID
            auditId: null,
            // Current editing audit object
            audit: {
                creator: {},
                name: "",
                auditType: "",
                client: {},
                company: {},
                collaborators: [],
                reviewers: [],
                date: "",
                date_start: "",
                date_end: "",
                scope: [],
                language: "",
                template: "",
                customFields: [],
                approvals: [],
                attachments: [],
            },
            auditOrig: {},
            // List of existing clients
            clients: [],
            // List of filtered clients when company is selected
            selectClients: [],
            // List of existing Collaborators
            collaborators: [],
            // List of existing reviewers
            reviewers: [],
            // List of existing Companies
            companies: [],
            // List of filtered companies
            selectCompanies: [],
            // List of existing Templates
            templates: [],
            // List of existing Languages
            languages: [],
            // List of existing audit types
            auditTypes: [],
            // List of Attachments
            attachments: [],
            // List of CustomFields
            customFields: [],
            AUDIT_VIEW_STATE: Utils.AUDIT_VIEW_STATE
        }
    },

    components: {
        Breadcrumb,
        TextareaArray,
        CustomFields
    },

    mounted: function() {
        this.auditId = this.$route.params.auditId;
        this.getAuditGeneral();
        this.getTemplates();
        this.getLanguages();
        this.getAuditTypes();

        this.$socket.emit('menu', {menu: 'general', room: this.auditId});

        // save on ctrl+s
        // var lastSave = 0;
        document.addEventListener('keydown', this._listener, false)
    },

    destroyed: function() {
        document.removeEventListener('keydown', this._listener, false)
    },

    beforeRouteLeave (to, from , next) {
        Utils.syncEditors(this.$refs)
        
        var displayHighlightWarning = this.displayHighlightWarning()

        if (!this.$_.isEqual(this.audit, this.auditOrig)){
            Dialog.create({
                title: $t('msg.thereAreUnsavedChanges'),
                message: $t('msg.doYouWantToLeave'),
                ok: {label: $t('btn.confirm'), color: 'negative'},
                cancel: {label: $t('btn.cancel'), color: 'white'},
                focus: 'cancel'
            })
            .onOk(() => next())
        }
        else if (displayHighlightWarning) {
            Dialog.create({
                title: $t('msg.highlightWarningTitle'),
                message: `${displayHighlightWarning}</mark>`,
                html: true,
                ok: {label: $t('btn.leave'), color: 'negative'},
                cancel: {label: $t('btn.stay'), color: 'white'},
            })
            .onOk(() => next())
        }
        else
            next()
    },

    methods: {
        _listener: function(e) {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
                e.preventDefault();
                if (this.frontEndAuditState === this.AUDIT_VIEW_STATE.EDIT)
                    this.updateAuditGeneral();
            }
        },

        // Get Audit datas from uuid
        getAuditGeneral: function() {
            DataService.getCustomFields()
            .then((data) => {
                this.customFields = data.data.datas
                return AuditService.getAudit(this.auditId)
            })
            .then((data) => {
                this.audit = data.data.datas;
                this.auditOrig = this.$_.cloneDeep(this.audit);
                this.getCollaborators();
                this.getReviewers();
                this.getClients();
            })
            .catch((err) => {              
                console.log(err.response)
            })
        },

        // Save Audit
        updateAuditGeneral: function() {
            Utils.syncEditors(this.$refs)
            this.$nextTick(() => {
                var customFieldsEmpty = this.$refs.customfields && this.$refs.customfields.requiredFieldsEmpty()
                var defaultFieldsEmpty = this.requiredFieldsEmpty()
                if (customFieldsEmpty || defaultFieldsEmpty) {
                    Notify.create({
                        message: $t('msg.fieldRequired'),
                        color: 'negative',
                        textColor:'white',
                        position: 'top-right'
                    })
                    return
                }
                AuditService.updateAuditGeneral(this.auditId, this.audit)
                .then(() => {
                    this.auditOrig = this.$_.cloneDeep(this.audit);
                    Notify.create({
                        message: $t('msg.auditUpdateOk'),
                        color: 'positive',
                        textColor:'white',
                        position: 'top-right'
                    })
                    this.getAuditGeneral()
                })
                .catch((err) => {
                    Notify.create({
                        message: err.response.data.datas,
                        color: 'negative',
                        textColor:'white',
                        position: 'top-right'
                    })
                })
            })
        },

        // Get Clients list
        getClients: function() {
            ClientService.getClients()
            .then((data) => {
                this.clients = data.data.datas;
                this.getCompanies();
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Companies list
        getCompanies: function() {
            CompanyService.getCompanies()
            .then((data) => {
                this.companies = data.data.datas;
                this.filterClients('init')
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Collaborators list
        getCollaborators: function() {
            CollabService.getCollabs()
            .then((data) => {
                var creatorId = ""
                if (this.audit.creator)
                    creatorId = this.audit.creator._id
                this.collaborators = data.data.datas.filter(e => e._id !== creatorId)
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Reviewers list
        getReviewers: function() {
            ReviewerService.getReviewers()
            .then((data) => {
                var creatorId = ""
                if (this.audit.creator)
                    creatorId = this.audit.creator._id
                this.reviewers = data.data.datas.filter(e => e._id !== creatorId)
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Templates list
        getTemplates: function() {
            TemplateService.getTemplates()
            .then((data) => {
                this.templates = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Languages list
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Audit types
        getAuditTypes: function() {
            DataService.getAuditTypes()
            .then((data) => {
                this.auditTypes = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Filter client options when selecting company
        filterClients: function(step) {
            if (step !== 'init') this.audit.client = null // only reset client when company is updated
            if (this.audit.company && this.audit.company.name) {
                this.selectClients = [];
                this.clients.map(client => {
                    if (client.company && client.company.name === this.audit.company.name) this.selectClients.push(client)
                })
            }
            else
                this.selectClients = this.$_.clone(this.clients);
        },

        // Set Company when selecting client 
        setCompanyFromClient: function(value) {
            if (value && !value.company) {
                this.audit.company = null;
            }
            else if (value) {
                for (var i=0; i<this.companies.length; i++) {
                    if (this.companies[i].name === value.company.name) {
                        this.audit.company = this.companies[i];
                        break;
                    }
                }
            }
        },

        createSelectCompany: function(val, done) {
            var index = this.companies.findIndex(e => Utils.normalizeString(e.name) === Utils.normalizeString(val))
            if (index > -1)
                done(this.companies[index], 'add-unique')
            else
                done({name: val}, 'add-unique')
        },

        filterSelectCompany (val, update) {
            if (val === '') {
                update(() => this.selectCompanies = this.companies)
                return
              }
            update(() => {
                const needle = Utils.normalizeString(val)
                this.selectCompanies = this.companies.filter(v => Utils.normalizeString(v.name).indexOf(needle) > -1)
            })
        },

        // return the first match of highlighted text found
        displayHighlightWarning: function() {
            if (!this.$settings.report.enabled || !this.$settings.report.public.highlightWarning)
                return null

            var matchString = `(<mark data-color="${this.$settings.report.public.highlightWarningColor}".+?>.+?)</mark>`
            var regex = new RegExp(matchString)
            
            if (this.audit.customFields && this.audit.customFields.length > 0) {
                for (let i in this.audit.customFields) {
                    let field = this.audit.customFields[i]
                    if (field.customField && field.text && field.customField.fieldType === "text") {
                        var result = regex.exec(field.text)
                        if (result && result[1])
                            return (result[1].length > 119) ? `<b>${field.customField.label}</b><br/>`+result[1].substring(0,119)+'...' : `<b>${field.customField.label}</b><br/>`+result[1]
                    }
                }
            }
            
            return null
        },

        requiredFieldsEmpty: function() {
            this.$refs.nameField.validate()
            this.$refs.companyField.validate()
            this.$refs.clientField.validate()
            this.$refs.dateStartField.validate()
            this.$refs.dateEndField.validate()
            this.$refs.dateReportField.validate()
            this.$refs.scopeField.validate()

            return (
                this.$refs.nameField.hasError ||
                this.$refs.companyField.hasError ||
                this.$refs.clientField.hasError ||
                this.$refs.dateStartField.hasError ||
                this.$refs.dateEndField.hasError ||
                this.$refs.dateReportField.hasError ||
                this.$refs.scopeField.hasError
            )
        },

        updateFiles (newFiles) {
            this.files = newFiles
            const promises = this.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const downloadNotif = Notify.create({
                        spinner: QSpinnerGears,
                        message: 'Uploading '+file.name ,
                        color: "blue",
                        timeout: 0,
                        group: false
                    })
                    let attachment = {}
                    attachment.name = file.name 
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onloadend = (e) => {
                        attachment.value = fileReader.result.split(',')[1]
                        resolve({attachment, downloadNotif})
                    };
                    fileReader.onerror = (e) => {
                        reject(e)
                    };
                })
            })
            Promise.all(promises).then((results) => {
                results.forEach(({ attachment, downloadNotif }) => {
                    this.audit.attachments.push(attachment)
                    downloadNotif({
                        icon: 'done',
                        spinner: false,
                        message: attachment.name + ' successfully uploaded',
                        color: 'green',
                        timeout: 3000
                    })
                })
                this.updateAuditGeneral()
            }).catch((err) => {
                console.log(err)
            })
            this.files = null
        },

        deleteDocument(index){
            //var removed = this.finding.externalAttachement.splice(index,1)
            AuditService.getAudit(this.auditId)
            .then(data => {
                AttachmentService.deleteAttachment(this.auditId, data.data.datas.attachments[index]._id)
                .then((data) => {
                 this.audit.attachments.splice(index,1)
                     this.updateAuditGeneral()
                     this.printPositiveMessage('Attachment successfully deleted')
                 })
                 .catch((err) => {
                     console.log(err)
                 })
            })
            .catch(err => {
                console.log(err)
                this.printNegativeMessage(err.response.data.datas)
            })
           

    const downloadDocument = async (index) => {
      try {
        const data = await AuditService.getAudit(auditId.value);
        const attachmentData = await AttachmentService.getAttachment(auditId.value, data.data.datas.attachments[index]._id);
        const file = attachmentData.data.datas;
        const blob = new Blob([Uint8Array.from(atob(file.value), c => c.charCodeAt(0))], {type: "application/octet-stream"});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        printPositiveMessage('Attachment successfully downloaded');
      } catch (err) {
        printNegativeMessage(err.response.data.datas);
      }
    };

    const printPositiveMessage = (message) => {
      Notify.create({
        message: t(message),
        type: 'positive',
        position: 'top-right',
        iconSize: '64px',
        iconColor: 'white',
        timeout: '5000',
      });
    };

    const printNegativeMessage = (message) => {
      Notify.create({
        message: t(message),
        type: 'negative',
        position: 'top-right',
        iconSize: '100px',
        iconColor: 'white',
        timeout: '7000',
      });
    };

    const _listener = (e) => {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault();
        if (props.frontEndAuditState === AUDIT_VIEW_STATE.EDIT) updateAuditGeneral();
      }
    };

    onMounted(() => {
      auditId.value = proxy.$route.params.auditId;
      getAuditGeneral();
      getTemplates();
      getLanguages();
      getAuditTypes();
      socket.emit('menu', { menu: 'general', room: auditId.value });
      document.addEventListener('keydown', _listener, false);
    });

    onUnmounted(() => {
      if (!loading.value) {
        socket.emit('leave', { username: user.username, room: auditId.value });
        socket.off();
      }
      document.removeEventListener('keydown', _listener, false);
    });

    return {
      t,
      audit,
      auditOrig,
      clients,
      selectClients,
      collaborators,
      reviewers,
      companies,
      selectCompanies,
      templates,
      languages,
      auditTypes,
      attachments,
      customFields,
      settings,
      loading,
      AUDIT_VIEW_STATE,
      getAuditGeneral,
      updateAuditGeneral,
      getClients,
      getCompanies,
      getCollaborators,
      getReviewers,
      getTemplates,
      getLanguages,
      getAuditTypes,
      filterClients,
      setCompanyFromClient,
      createSelectCompany,
      filterSelectCompany,
      displayHighlightWarning,
      updateFiles,
      deleteDocument,
      downloadDocument,
      printPositiveMessage,
      printNegativeMessage,
      requiredFieldsEmpty
    };
  },
  components: {
    Breadcrumb,
    TextareaArray,
    CustomFields,
    BasicEditor,
  },
};