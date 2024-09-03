import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './EditPost.css';
import apiUrl from '../config'; 

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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // カテゴリの取得
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // 投稿データの取得
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts/${id}`);
        const post = response.data;
        setTitle(post.title);
        setMarkdownContent(post.content);
        setSelectedCategory(post.category); 
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/posts/${id}`, {
        title,
        content: markdownContent,
        category: selectedCategory,
      });
      console.log('Post updated:', response.data);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleMarkdownChange = (e) => {
    setMarkdownContent(e.target.value);
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
    <div className="edit-post-container">
      <Link to="/" className="home-button">Homeに戻る</Link>
      <h2 className="title">記事を編集する</h2>
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
        <button type="submit" className="button">更新する</button>
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

export default EditPost;
