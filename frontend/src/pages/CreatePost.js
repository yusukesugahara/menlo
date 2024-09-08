import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CreatePost.css';
import apiUrl from '../config';

const customStyle = {
  ...dark,
  'code[class*="language-"]': {
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
  'pre[class*="language-"]': {
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      navigate('/login');
      return;
    }

    const keywordArray = keywords.split(' ').filter(keyword => keyword !== '');
    if (keywordArray.length > 5) {
      setError('You can only specify up to 5 keywords.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/posts`, {
        title,
        content: markdownContent,
        keywords: keywordArray,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Post created:', response.data);
      setTitle('');
      setMarkdownContent('');
      setKeywords('');
      setError('');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
      if (error.response && error.response.status === 401) {
        setError('Token expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleMarkdownChange = (e) => {
    setMarkdownContent(e.target.value);
  };

  // クリップボードにコピー
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };


  return (
    <div className="create-post-container">
      <Link to="/" className="home-button">Homeに戻る</Link>
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
            <label htmlFor="keywords">キーワード</label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="キーワードを半角スペース区切りで5つまで入力"
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
            <ReactMarkdown components={{ code: ({ node, inline, className, children, ...props }) => (
              <SyntaxHighlighter style={customStyle} language={className ? className.replace('language-', '') : ''} PreTag="div" {...props}>
                {children}
              </SyntaxHighlighter>
            ) }}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
        <button type="submit" className="button">投稿する</button>
      </form>
      {error && <p className="error-message">{error}</p>}
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
          <li><strong>リンク:</strong> <code onClick={() => copyToClipboard('[リンクテキスト](URL)')}>[リンクテキスト](URL)</code></li>
          <li><strong>画像:</strong> <code onClick={() => copyToClipboard('![代替テキスト](画像のURL)')}>![代替テキスト](画像のURL)</code></li>
          <li><strong>インラインコード:</strong> <code onClick={() => copyToClipboard('`コード`')}>`コード`</code></li>
          <li><strong>コードブロック:</strong></li>
          <pre onClick={() => copyToClipboard("```ChatGPT\nコードブロック\n```")}><code>```ChatGPT<br />コードブロック<br />```</code></pre>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;
