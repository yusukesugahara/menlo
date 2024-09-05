import axios from 'axios';
import apiUrl from '../config';  // APIのベースURLをインポート

const api = axios.create({
  baseURL: apiUrl,  // APIベースURLを設定
});

// インターセプターを使ってエラーハンドリングを追加
api.interceptors.response.use(
  (response) => response,  // 正常なレスポンスはそのまま返す
  (error) => {
    if (error.response && error.response.status === 401) {  // 401エラーをキャッチ
      const errorMessage = error.response.data?.message;

      if (errorMessage === 'Token expired') {  // トークン期限切れのみ処理
        console.error('Token expired. Redirecting to login.');
        localStorage.removeItem('token');  // トークンを削除
        window.location.href = '/login';  // ログイン画面にリダイレクト
      }
    }

    return Promise.reject(error);  // エラーはそのまま返す
  }
);

export default api;
