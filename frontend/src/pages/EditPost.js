import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DeleteButton from '../components/DeleteButton';
import './EditPost.css';
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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts/${id}`);
        const post = response.data;
        setTitle(post.title);
        setMarkdownContent(post.content);
        setKeywords(post.keywords.join(' ')); // キーワードをスペースで区切って表示
        
        const userId = localStorage.getItem('userId');
        if (post.author === userId) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Post not found or you do not have permission to edit this post.');
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to edit a post.');
      navigate('/login');
      return;
    }

    const keywordArray = keywords.split(' ').filter((kw) => kw !== ''); // 空白を除く
    if (keywordArray.length > 5) {
      setError('You can specify up to 5 keywords.');
      return;
    }

    try {
      const response = await axios.put(`${apiUrl}/api/posts/${id}`, {
        title,
        content: markdownContent,
        keywords: keywordArray, // キーワードを配列として送信
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Post updated:', response.data);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Error updating post. You may not have permission.');
    }
  };

  const handleMarkdownChange = (e) => {
    setMarkdownContent(e.target.value);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value); // キーワード入力を管理
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
            <label htmlFor="keywords">キーワード</label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={handleKeywordsChange}
              placeholder="キーワードをスペースで区切って5つまで"
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
        <button type="submit" className="btn">更新する</button>
      </form>
      <DeleteButton postId={id} isOwner={isOwner} />
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
