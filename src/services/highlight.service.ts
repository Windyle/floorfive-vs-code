import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import powershell from 'highlight.js/lib/languages/powershell';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { HighlightLanguages } from '../core/enums/highlight-languages';

export class Highlight {

    public static registerLanguages = () => {
        hljs.registerLanguage('bash', bash);
        hljs.registerLanguage('csharp', csharp);
        hljs.registerLanguage('css', css);
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('json', json);
        hljs.registerLanguage('markdown', markdown);
        hljs.registerLanguage('powershell', powershell);
        hljs.registerLanguage('scss', scss);
        hljs.registerLanguage('shell', shell);
        hljs.registerLanguage('sql', sql);
        hljs.registerLanguage('typescript', typescript);
        hljs.registerLanguage('xml', xml);
    };

    public static highlight = (code: string, language: HighlightLanguages) => {
        const highlightedCode = hljs.highlight(code, { language }).value;
        return highlightedCode;
    };
}