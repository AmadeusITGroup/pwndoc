<template>
    <q-card flat bordered class="editor full-width" :class="affixRelativeElement" :style="(editable)?'':'border: 5px dashed lightgrey; background-color: #f0f0f0;'">
        <affix :relative-element-selector="'.'+affixRelativeElement" :enabled="!noAffix && !diff" class="bg-grey-4" v-if="editable || diff">
                <q-toolbar class="editor-toolbar">
                    <template v-if="editable">
                        <div v-if="toolbar.indexOf('format') !== -1">
                            <q-tooltip :delay="500" content-class="text-bold">Text Format (Ctrl+Alt+[0-6])</q-tooltip>
                            <q-btn-dropdown size="sm" unelevated dense :icon="formatIcon" :label="formatLabel" style="width:42px" class="text-bold">
                                <q-list dense>
                                    <q-item 
                                    clickable 
                                    :class="{ 'is-active': editor.isActive('paragraph') }" 
                                    @click="editor.chain().focus().setParagraph().run()">
                                        <q-item-section>
                                            <q-icon name="fa fa-paragraph" />
                                        </q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable 
                                    :class="{ 'is-active': editor.isActive('heading', {level: 1}) }" 
                                    @click="editor.chain().focus().setHeading({level: 1}).run()">
                                        <q-item-section>H1</q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable
                                    :class="{ 'is-active': editor.isActive('heading', {level: 2}) }"
                                    @click="editor.chain().focus().setHeading({level: 2}).run()">
                                        <q-item-section>H2</q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable
                                    :class="{ 'is-active': editor.isActive('heading', {level: 3}) }"
                                    @click="editor.chain().focus().setHeading({level: 3}).run()">
                                        <q-item-section>H3</q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable
                                    :class="{ 'is-active': editor.isActive('heading', {level: 4}) }"
                                    @click="editor.chain().focus().setHeading({level: 4}).run()">
                                        <q-item-section>H4</q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable
                                    :class="{ 'is-active': editor.isActive('heading', {level: 5}) }"
                                    @click="editor.chain().focus().setHeading({level: 5}).run()">
                                        <q-item-section>H5</q-item-section>
                                    </q-item>
                                    <q-item 
                                    clickable
                                    :class="{ 'is-active': editor.isActive('heading', {level: 6}) }"
                                    @click="editor.chain().focus().setHeading({level: 6}).run()">
                                        <q-item-section>H6</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('format') !== -1" />
                        
                        <div v-if="toolbar.indexOf('marks') !== -1">
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('bold') }"
                            @click="editor.chain().focus().toggleBold().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Bold (Ctrl+B)</q-tooltip>
                                <q-icon name="format_bold" />
                            </q-btn>
    
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('italic') }"
                            @click="editor.chain().focus().toggleItalic().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Italic (Ctrl+I)</q-tooltip>
                                <q-icon name="format_italic" />
                            </q-btn>
    
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('underline') }"
                            @click="editor.chain().focus().toggleUnderline().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Underline (Ctrl+U)</q-tooltip>
                                <q-icon name="format_underline" />
                            </q-btn>
    
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('strike') }"
                            @click="editor.chain().focus().toggleStrike().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Strikethrough (Ctrl+Shift+S)</q-tooltip>
                                <q-icon name="format_strikethrough" />
                            </q-btn>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('marks') !== -1" />
    
                        <div v-if="toolbar.indexOf('list') !== -1">
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('bulletList') }"
                            @click="editor.chain().focus().toggleBulletList().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Bullets (Ctrl+Shift+8)</q-tooltip>
                                <q-icon name="format_list_bulleted" />
                            </q-btn>
    
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('orderedList') }"
                            @click="editor.chain().focus().toggleOrderedList().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Numbering (Ctrl+Shift+7)</q-tooltip>
                                <q-icon name="format_list_numbered" />
                            </q-btn>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('list') !== -1" />
    
                        <div v-if="toolbar.indexOf('code') !== -1">
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('code') }"
                            @click="editor.chain().focus().toggleCode().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Code (Ctrl+E)</q-tooltip>
                                <q-icon name="code" />
                            </q-btn>
    
                            <q-btn flat size="sm" dense
                            :class="{ 'is-active': editor.isActive('codeBlock') }"
                            @click="editor.chain().focus().toggleCodeBlock().run()"
                            >
                                <q-tooltip :delay="500" content-class="text-bold">Code Block (Ctrl+Alt+C)</q-tooltip>
                                <q-icon name="mdi-console" />
                            </q-btn>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('code') !== -1" />
                            
                        <div v-if="toolbar.indexOf('image') !== -1">
                            <q-tooltip :delay="500" content-class="text-bold">Insert Image</q-tooltip>
                            <q-btn flat size="sm" dense>
                                <label class="cursor-pointer">
                                    <input
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="importImage($event.target.files)"
                                    :disabled="!editable"
                                    />
                                    <q-icon name="image" />
                                </label>
                            </q-btn>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('image') !== -1" />
    
                        <div v-if="toolbar.indexOf('caption') !== -1">
                            <q-tooltip :delay="500" content-class="text-bold">Insert Caption</q-tooltip>
                            <q-btn-dropdown flat size="sm" dense icon="subtitles">
                                <q-list dense>
                                    <q-item v-for="caption of $settings.report.public.captions" :key="caption" clickable v-close-popup @click="editor.chain().focus().setCaption({label: caption, alt: ''}).run()">
                                        <q-item-section>{{caption}}</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                        <q-separator vertical class="q-mx-sm" v-if="toolbar.indexOf('caption') !== -1" />
    
                        <q-btn flat size="sm" dense
                        @click="editor.commands.undo"
                        >
                            <q-tooltip :delay="500" content-class="text-bold">Undo (Ctrl+Z)</q-tooltip>
                            <q-icon name="undo" />
                        </q-btn>
    
                        <q-btn flat size="sm" dense
                        @click="editor.commands.redo"
                        >
                            <q-tooltip :delay="500" content-class="text-bold">Redo (Ctrl+Shift+Z)</q-tooltip>
                            <q-icon name="redo" />
                        </q-btn>

                        <q-btn flat size="sm" dense
                        @click="rephraseContent"
                        >
                            <q-tooltip :delay="500" content-class="text-bold">Rephrase - AI powered</q-tooltip>
                            <q-icon name="auto_awesome" />
                        </q-btn>
    
                    </template>
                    <div v-if="diff !== undefined && (diff || value) && value !== diff">
                        <q-btn flat size="sm" dense
                        :class="{'is-active': toggleDiff}"
                        label="toggle diff"
                        @click="toggleDiff = !toggleDiff"
                        />
                    </div>
    
                </q-toolbar>
        </affix>
        <q-separator />
        <editor-content :editor="editor" class="editor__content" />
    </q-card>
    </template>
    
<script>
// Import the editor
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CustomImage from './editor-image';
import Caption from './editor-caption';
import TrailingNode from './editor-trailing-node';
import Diff from 'diff';
import Utils from '@/services/utils';
import ImageService from '@/services/image';
import AIService from '@/services/ai';
import { Notify } from 'quasar';


export default {
  name: 'BasicEditor',
  props: {
    modelValue: String,
    editable: {
      type: Boolean,
      default: true,
    },
    toolbar: {
      type: Array,
      default: () => ['format', 'marks', 'list', 'code', 'image', 'caption'],
    },
    noAffix: {
      type: Boolean,
      default: false,
    },
    diff: String,
    disableDrop: {
      type: Boolean,
      default: false,
    },
    noSync: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EditorContent,
  },
  setup(props, { emit }) {
    const editor = ref(
      new Editor({
        extensions: [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3, 4, 5, 6],
            },
          }),
          Underline,
          CustomImage,
          Caption,
          TrailingNode.configure({
            node: 'paragraph',
            notAfter: ['paragraph', 'heading', 'bullet_list', 'ordered_list', 'code_block'],
          }),
        ],
        onUpdate: ({ getJSON, getHTML }) => {
          if (props.noSync) return;
          updateHTML();
        },
        enableInputRules: false,
        enablePasteRules: false,
      })
    );

    const state = reactive({
      json: '',
      html: '',
      toggleDiff: true,
      affixRelativeElement: `affix-relative-element-${Math.floor(Math.random() * 1000000 + 1)}`,
      htmlEncode: Utils.htmlEncode,
    });

    // Author : Chapizze
    const rephraseContent = async () => {
      const data = {};
      const selection = editor.value.state.selection;
      const selectedText = editor.value.state.doc.textBetween(selection.from, selection.to, ' ');

      if (!selectedText) {
        Notify.create({
          message: 'Please select some text to rephrase.',
          color: 'negative',
          position: 'top',
        });
        return;
      }

      data.content = selectedText;

      try {
        const rephrased = await AIService.rephrase(data);
        const text = rephrased.data.datas;

        // Create a modal for the suggestion
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '1000';
        modal.style.width = '80%';
        modal.style.maxWidth = '600px';
        modal.style.borderRadius = '8px';
        modal.style.fontFamily = 'Arial, sans-serif';

        // Create the old text container
        const oldTextContainer = document.createElement('div');
        oldTextContainer.style.color = 'red';
        oldTextContainer.style.marginBottom = '10px';
        oldTextContainer.innerHTML = `<strong>Old Text:</strong><br>${data.content}`;

        // Create the suggestion text container
        const suggestionTextContainer = document.createElement('div');
        suggestionTextContainer.style.color = 'green';
        suggestionTextContainer.style.marginBottom = '10px';
        suggestionTextContainer.innerHTML = `<strong>AI Suggestion:</strong><br>${text}`;

        // Create buttons for accepting or rejecting the suggestion
        const acceptButton = document.createElement('button');
        acceptButton.innerText = 'Accept AI Suggestion';
        acceptButton.style.marginRight = '10px';
        acceptButton.style.backgroundColor = 'green';
        acceptButton.style.color = 'white';
        acceptButton.style.border = 'none';
        acceptButton.style.padding = '10px 20px';
        acceptButton.style.borderRadius = '5px';
        acceptButton.style.cursor = 'pointer';
        acceptButton.style.fontSize = '16px';

        const rejectButton = document.createElement('button');
        rejectButton.innerText = 'Keep Old Text';
        rejectButton.style.backgroundColor = 'red';
        rejectButton.style.color = 'white';
        rejectButton.style.border = 'none';
        rejectButton.style.padding = '10px 20px';
        rejectButton.style.borderRadius = '5px';
        rejectButton.style.cursor = 'pointer';
        rejectButton.style.fontSize = '16px';

        // Append elements to the modal
        modal.appendChild(oldTextContainer);
        modal.appendChild(suggestionTextContainer);
        modal.appendChild(acceptButton);
        modal.appendChild(rejectButton);

        // Append the modal to the body
        document.body.appendChild(modal);

        // Add event listeners to the buttons
        acceptButton.addEventListener('click', () => {
          editor.value.chain().focus()
            .deleteSelection()
            .insertContent(text)
            .run();
          document.body.removeChild(modal);
        });

        rejectButton.addEventListener('click', () => {
          document.body.removeChild(modal);
        });

      } catch (error) {
        console.log(error);
      }
    };

    const updateHTML = () => {
      state.json = editor.value.getJSON();
      state.html = editor.value.getHTML();
      if (Array.isArray(state.json.content) && state.json.content.length === 1 && !state.json.content[0].hasOwnProperty('content')) {
        state.html = '';
      }
      emit('update:modelValue', state.html);
    };

    const importImage = (files) => {
      const file = files[0];
      const fileReader = new FileReader();

      let auditId = null;
      const path = window.location.pathname.split('/');
      if (path && path.length > 3 && path[1] === 'audits') auditId = path[2];

      fileReader.onloadend = () => {
        Utils.resizeImg(fileReader.result)
          .then((data) => ImageService.createImage({ value: data, name: file.name, auditId }))
          .then((data) => {
            editor.value.chain().focus().setImage({ src: data.data.datas._id, alt: file.name }).run();
          })
          .catch((err) => console.log(err));
      };

      fileReader.readAsDataURL(file);
    };

    const convertParagraphsToHTML = (paragraphs) => {
      let result = '';
      paragraphs.forEach((p) => {
        result += `<p>${p.text}</p>`;
        if (p.images.length > 0) {
          // handle images
        }
      });
      return result;
    };

    const formatIcon = computed(() => {
      if (editor.value.isActive('paragraph')) return 'fa fa-paragraph';
      return null;
    });

    const formatLabel = computed(() => {
      if (editor.value.isActive('heading', { level: 1 })) return 'H1';
      if (editor.value.isActive('heading', { level: 2 })) return 'H2';
      if (editor.value.isActive('heading', { level: 3 })) return 'H3';
      if (editor.value.isActive('heading', { level: 4 })) return 'H4';
      if (editor.value.isActive('heading', { level: 5 })) return 'H5';
      if (editor.value.isActive('heading', { level: 6 })) return 'H6';
      return null;
    });

    const diffContent = computed(() => {
      let content = '';
      if (typeof props.diff !== 'undefined') {
        const HtmlDiff = new Diff.Diff(true);
        HtmlDiff.tokenize = (value) => value.split(/([{}:;,.]|<p>|<\/p>|<pre><code>|<\/code><\/pre>|<[uo]l><li>.*<\/li><\/[uo]l>|\s+)/);
        const value = props.value || '';
        const diff = HtmlDiff.diff(props.diff, value);
        diff.forEach((part) => {
          const diffclass = part.added ? 'diffadd' : part.removed ? 'diffrem' : 'diffeq';
          let value = part.value.replace(/<p><\/p>/g, '<p><br></p>');
          if (part.added || part.removed) {
            value = value
              .replace(/(<p>)(.+?)(<\/p>|$)/g, `$1<span class="${diffclass}">$2</span>$3`) // Insert span diffclass in paragraphs
              .replace(/(<pre><code>)(.+?)(<\/code><\/pre>|$)/g, `$1<span class="${diffclass}">$2</span>$3`) // Insert span diffclass in codeblocks
              .replace(/(^[^<].*?)(<|$)/g, `<span class="${diffclass}">$1</span>$2`); // Insert span diffclass if text only
          }
          content += value;
        });
      }
      return content;
    });

    watch(
      () => props.modelValue,
      (value) => {
        if (value === editor.value.getHTML()) return;
        const content = state.htmlEncode(value);
        editor.value.commands.setContent(content);
      }
    );

    watch(
      () => props.editable,
      (value) => {
        editor.value.setEditable(value, false);
      }
    );

    onMounted(() => {
      editor.value.setEditable(props.editable, false);
      if (props.modelValue === editor.value.getHTML()) return; 
      const content = state.htmlEncode(props.modelValue);
      editor.value.commands.setContent(content);
    });

    onBeforeUnmount(() => {
      editor.value.destroy();
    });

    return {
      editor,
      state,
      formatIcon,
      formatLabel,
      diffContent,
      importImage,
      updateHTML,
      convertParagraphsToHTML,
      rephraseContent
    };
  },
};
    </script>
    
    <style lang="scss">
    .editor {
        :focus {
            outline: none;
        }
    
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        ul,
        ol,
        pre,
        blockquote {
            &:first-child {
                margin-top: 0;
            }
    
            &:last-child {
                margin-bottom: 0;
            }
        }
    
        .affix {
            width: auto;
            border-bottom: 1px solid rgba(0,0,0,0.12);
            border-right: 1px solid rgba(0,0,0,0.12);
            top: 50px!important;
            z-index: 1000;
            position: fixed;
        }
    
        .affix-top {
            top: unset!important;
        }
    }
    
    .editor {
      &__content {
    
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
    
        .ProseMirror {
            min-height: 200px;
            cursor: auto;
        }
    
        h1 {
            font-size: 4.25rem;
        }
    
        pre {
          padding: 0.7rem 1rem;
          border-radius: 5px;
          background: black;
          color: white;
          font-size: 0.8rem;
          overflow-x: auto;
          white-space: pre-wrap;
    
          code {
            display: block;
          }
        }
    
        p code {
          padding: 0.2rem 0.4rem;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: bold;
          background: rgba(black, 0.1);
          color: rgba(black, 0.8);
        }
    
        ul,
        ol {
          padding-left: 1rem;
        }
    
        li > p,
        li > ol,
        li > ul {
          margin: 0;
        }
    
        a {
          color: inherit;
        }
    
        blockquote {
          border-left: 3px solid rgba(black, 0.1);
          color: rgba(black, 0.8);
          padding-left: 0.8rem;
          font-style: italic;
    
          p {
            margin: 0;
          }
        }
    
        img {
          max-width: 100%;
          border-radius: 3px;
        }
    
        .selected {
            outline-style: solid;
            outline-color: $blue-4;
        }
    
        table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
    
          td, th {
            min-width: 1em;
            border: 2px solid grey;
            padding: 3px 5px;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;
            > * {
              margin-bottom: 0;
            }
          }
    
          th {
            font-weight: bold;
            text-align: left;
          }
    
          .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: "";
            left: 0; right: 0; top: 0; bottom: 0;
            background: rgba(200, 200, 255, 0.4);
            pointer-events: none;
          }
    
          .column-resize-handle {
            position: absolute;
            right: -2px; top: 0; bottom: 0;
            width: 4px;
            z-index: 20;
            background-color: #adf;
            pointer-events: none;
          }
        }
    
        .tableWrapper {
          margin: 1em 0;
          overflow-x: auto;
        }
    
        .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
    
      }
    }
    .is-active {
        color: green;
    }
    .editor-toolbar {
        min-height: 32px;
    }
    
    .diffrem {
        background-color: #fdb8c0;
    }
    pre .diffrem {
        background-color: $red-6;
    }
    
    .diffadd {
        background-color: #acf2bd;
    }
    pre .diffadd {
        background-color: $green-6;
    }
    
    .text-negative .editor:not(.q-dark) {
        color:var(--q-color-primary)!important;
    }
    
    </style>