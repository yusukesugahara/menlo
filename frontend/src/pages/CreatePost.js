import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Linkをインポート
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CreatePost.css';

const customStyle = {
  ...dark,
  'code[class*="language-"]': {
    ...dark['code[class*="language-"]'],
    color: '#ffffff', // 文字を白に設定
    background: '#000000', // 背景を黒に設定
    textShadow: 'none', // テキストシャドウを削除
    border: 'none',
  },
  'pre[class*="language-"]': {
    ...dark['pre[class*="language-"]'],
    color: '#ffffff', // 文字を白に設定
    background: '#000000', // 背景を黒に設定
    textShadow: 'none', // テキストシャドウを削除
    border: 'none',
  },
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Title:', title);
    console.log('Content:', content);
    // フォームをリセット
    setTitle('');
    setContent('');
    setMarkdownContent('');
  };

  const handleMarkdownChange = (e) => {
    setMarkdownContent(e.target.value);
    setContent(e.target.value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="code-block">
          <button className="copy-button" onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}>コピー</button>
          <SyntaxHighlighter language={match[1]} style={customStyle} PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="create-post-container">
      <Link to="/" className="home-button">Homeに戻る</Link> {/* Homeに戻るボタンを追加 */}
      <h2 className="title">新しい記事を投稿する</h2>
      <form onSubmit={handleSubmit}>
        <div className="content-preview">
          <div className="form-group content-area">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="content">内容</label>
            <textarea
              id="content"
              value={markdownContent}
              onChange={handleMarkdownChange}
              placeholder="Markdown形式で内容を入力してください"
              required
            />
          </div>
          <div className="preview">
            <h3>プレビュー</h3>
            <ReactMarkdown components={components}>{markdownContent}</ReactMarkdown>
          </div>
        </div>
        <button type="submit" className="button">投稿する</button>
      </form>
      <div className="markdown-tutorial">
        <h3>Markdownの書き方</h3>
        <ul>
          <li><strong>見出し:</strong> <code onClick={() => copyToClipboard('# 見出し1')}># 見出し1</code>, <code onClick={() => copyToClipboard('## 見出し2')}>## 見出し2</code>, <code onClick={() => copyToClipboard('### 見出し3')}>### 見出し3</code></li>
          <li><strong>太字:</strong> <code onClick={() => copyToClipboard('**太字**')}>**太字**</code></li>
          <li><strong>斜体:</strong> <code onClick={() => copyToClipboard('*斜体*')}>*斜体*</code></li>
          <li><strong>リスト:</strong></li>
          <ul>
            <li onClick={() => copyToClipboard('1. 項目1')}>順序付きリスト: <code>1. 項目1</code>, <code onClick={() => copyToClipboard('2. 項目2')}>2. 項目2</code></li>
            <li onClick={() => copyToClipboard('- 項目1')}>順序なしリスト: <code>- 項目1</code>, <code onClick={() => copyToClipboard('- 項目2')}>- 項目2</code></li>
          </ul>
          <li><strong>リンク:</strong> <code onClick={() => copyToClipboard('[リンクテキスト](URL)')} >[リンクテキスト](URL)</code></li>
          <li><strong>画像:</strong> <code onClick={() => copyToClipboard('![代替テキスト](画像のURL)')} >![代替テキスト](画像のURL)</code></li>
          <li><strong>インラインコード:</strong> <code onClick={() => copyToClipboard('`コード`')}>`コード`</code></li>
          <li><strong>コードブロック:</strong></li>
          <pre onClick={() => copyToClipboard("```ChatGPT\nコードブロック\n```")}><code>```ChatGPT<br></br>コードブロック<br></br>```</code></pre>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;
