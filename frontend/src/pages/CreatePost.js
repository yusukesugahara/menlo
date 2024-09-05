import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CreatePost.css';
import apiUrl from '../config'; 
import api from '../utils/api';

const customStyle = {
  ...dark,
  'code[class*="language-"]': {
    ...dark['code[class*="language-"]'],
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
  'pre[class*="language-"]': {
    ...dark['pre[class*="language-"]'],
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // カテゴリデータを取得
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!token) {
        setError('You must be logged in to create a post.');
        navigate('/login');  // ログイン画面に遷移
      }
    }
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      navigate('/login');  // ログイン画面に遷移
    }

    try {
      const response = await axios.post(`${apiUrl}/api/posts`, {
        title,
        content: markdownContent,
        category: selectedCategory,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Post created:', response.data);
      setTitle('');
      setMarkdownContent('');
      setSelectedCategory('');
      setError('');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
      if (error.response && error.response.status === 401) {
        setError('Token expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');  // ログイン画面にリダイレクト
      }
    }
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

  // Markdownの変更イベント
  const handleMarkdownChange = (e) => {
    setMarkdownContent(e.target.value);
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
            <label htmlFor="category">カテゴリ</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">カテゴリを選択</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
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
