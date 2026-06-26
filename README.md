
# こどもがくしゅう（children_study）

子供向けの学習アプリ。**カテゴリ × レベル**で少しずつ増やしていける構成です。
第1弾は **日本語の読み書き**（ひらがな・カタカナ・かんたんな単語・漢字 小1）。

スマホのブラウザで動く **PWA**（ホーム画面に追加してアプリのように使えます）。React + TypeScript + Vite 製。

## できること

- **よむ**：文字・単語・漢字を大きく表示し、🔊ボタンで読み上げ（端末の音声合成 / 日本語）
- **かく**：うすいお手本の上を指やマウスでなぞって書く練習（なぞり書きキャンバス）
- **進捗**：クリアした項目数を ⭐ で表示（端末内 localStorage に保存）
- 大きなボタン・鮮やかな配色で、子供がひとりでも操作しやすい画面

## 開発

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー（http://localhost:5173）
npm run build    # 型チェック＋本番ビルド（dist/）
npm run preview  # ビルド結果の確認
```

## 構成（拡張のしかた）

学習コンテンツはすべてデータ駆動です。`src/data/types.ts` の型に沿ってデータを足すだけで増やせます。

```
src/
  data/
    types.ts        … Category / Level / LearningItem の型定義
    curriculum.ts   … カテゴリとレベルの組み立て（ここに追加していく）
    hiragana.ts / katakana.ts / words.ts / kanji.ts … 各レベルの中身
  hooks/
    useSpeech.ts        … 日本語の読み上げ（Web Speech API）
    useProgress.ts      … 進捗の保存（localStorage）
    ProgressContext.tsx … 進捗をアプリ全体で共有
  screens/
    HomeScreen.tsx   … カテゴリ・レベル一覧
    LevelScreen.tsx  … アクティビティ選択（よむ／かく）
    ActivityScreen.tsx … アクティビティの振り分け
  activities/
    ReadActivity.tsx … 「よむ」
    WriteActivity.tsx … 「かく」
  components/
    TracingCanvas.tsx … なぞり書きキャンバス
    Celebration.tsx   … クリア時のおいわい
    BackButton.tsx
```

### あたらしいレベルを足す

1. `src/data/` に項目データを作る（`LearningItem[]`）
2. `src/data/curriculum.ts` の対象カテゴリの `levels` に `Level` を追加する

### あたらしいカテゴリ（例：さんすう）を足す

`src/data/curriculum.ts` の `curriculum` 配列に `Category` を1つ追加するだけです。
読み上げ・なぞり書き・進捗表示はそのまま使えます。
