---
name: tsukiusa-research
description: 「月ウサギのそだてかた」の最新ゲーム情報を公式Discord（パッチノート/お知らせ）と公式@wikiから収集し、docs/ 配下のナレッジに反映する。新武器・新ガチャレベル・新コンテンツの調査、パッチノートの要約、武器データの更新時に使う。
---

# 月ウサギ情報リサーチ

公式Discord と 公式@wiki から情報を集め、`docs/` に反映するための手順。

## 情報源

| 情報源 | URL | 何が取れるか | 形式 |
|---|---|---|---|
| Discord #パッチノート | `https://discord.com/channels/974314243203678268/991616949937250414` | 最新アップデート内容（最も速い） | **画像スライド**（要OCR） |
| Discord #お知らせ | 同サーバー内 | メンテ・障害・キャンペーン | 画像＋テキスト |
| Discord #クーポン | 同サーバー内 | クーポンコード | テキスト中心 |
| 公式@wiki | `https://w.atwiki.jp/tsukiusa/` | 武器/装身具/スキルの**確定数値**（表形式） | HTML（構造化） |

**原則: 数値データは @wiki を正とし、Discord は「いつ何が追加されたか」の一次ソースとして使う。**

## 1. @wiki から数値を取る（速い・優先）

`WebFetch` は 403 になる。Chrome拡張タブから `fetch` する。

```js
// ページ一覧（ID → ページ名）
const r = await fetch('/tsukiusa/list', {credentials:'include'});
const d = new DOMParser().parseFromString(await r.text(),'text/html');
const seen = new Set();
[...d.querySelectorAll('a')]
  .filter(a=>/w\.atwiki\.jp\/tsukiusa\/pages\/\d+\.html/.test(a.getAttribute('href')||''))
  .map(a=>[a.textContent.trim(), a.getAttribute('href').match(/(\d+)\.html/)[1]])
  .filter(([n,id])=>!seen.has(id)&&seen.add(id))
  .map(x=>x[1]+':'+x[0]).join(' / ')
```

```js
// 個別ページ本文
async function pg(id){
  const r = await fetch('/tsukiusa/pages/'+id+'.html',{credentials:'include'});
  const d = new DOMParser().parseFromString(await r.text(),'text/html');
  return d.querySelector('#wikibody').innerText.replace(/\n{3,}/g,'\n\n').trim();
}
await pg(305)
```

### 既知のページID
| ID | ページ |
|---|---|
| 305 | 武器（全等級の攻撃力一覧・最重要） |
| 306 | 装身具 |
| 327 | 製作 |
| 328 | 宝石 |
| 1301 | ソウルウェポン |
| 1493 | 銀色の銀河バズーカ（U3） |
| 1501-1504 | 各種指輪 |
| 446 | パッチノート（目次のみ） |

### 画像の取得
wiki の画像は署名不要で落とせるが、**ブラウザ相当のヘッダーを揃えないと 403 になるものがある**
（拡張子が大文字 `.PNG` のファイルで発生した）。最初から以下のヘッダーで叩くこと。

```bash
curl -s --http1.1 -o out.png -w "%{http_code}\n" \
 -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' \
 -H 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' \
 -H 'Referer: https://w.atwiki.jp/' \
 -H 'Sec-Fetch-Dest: image' -H 'Sec-Fetch-Mode: no-cors' -H 'Sec-Fetch-Site: cross-site' \
 "https://img.atwiki.jp/tsukiusa/attach/<PAGE_ID>/<N>/<FILE>"
```

サイズは既存アセットに揃える（武器 400x400 / スキルアイコン 128x128）。
`sips -z H W file.png` でリサイズ。落とし終えたら必ず検証する:

```bash
file src/assets/skills/*.png | grep -v "PNG image data, 128 x 128"   # 何も出なければOK
```

失敗すると **HTMLのエラーページが .png として保存される**ので、`file` での確認は必須。

### アイコンを一括で集める
一覧ページ内のリンクから個別ページIDを取り、各ページの先頭画像を拾う。
1回のJSで73件 fetch すると CDP がタイムアウトするので **25件ずつ**に区切る。

```js
window.__links=[...document.querySelectorAll('#wikibody table a')]
  .map(a=>({name:a.textContent.trim(), id:(a.getAttribute('href')||'').match(/(\d+)\.html/)?.[1]}))
  .filter(x=>x.id&&x.name);
window.__icons=window.__icons||{};
for(const x of window.__links.filter(x=>!(x.id in window.__icons)).slice(0,25)){
  const r=await fetch('/tsukiusa/pages/'+x.id+'.html',{credentials:'include'});
  const d=new DOMParser().parseFromString(await r.text(),'text/html');
  window.__icons[x.id]=d.querySelector('#wikibody img')?.getAttribute('src')??null;
}
Object.keys(window.__icons).length+' / '+window.__links.length
```

### シェルの落とし穴
zsh では `path` は `PATH` に連動する特殊変数。`while read -r id path` のように使うと
PATH が壊れて `command not found` が連発する。別名（`rel` など）にすること。

注意: `/tsukiusa/search` はボット検証が入るので使わない。ページ一覧から探すこと。

### 表の取り出し
wiki の表は等級列などに `rowspan` を使っている。`innerText` で取ると行の対応が崩れるので、
`table.rows` を回して**セル数で判定**する:

```js
const t=document.querySelector('#wikibody table');
let group=null; const out=[];
for(let i=1;i<t.rows.length;i++){
  let c=[...t.rows[i].cells].map(x=>x.innerText.trim().replace(/\s+/g,' '));
  if(c.length===COLS+1){group=c[0];c=c.slice(1);}  // rowspan の親行
  if(c.length!==COLS||!c[0]) continue;
  out.push([group,...c].join('\t'));
}
out.join('\n')
```

出力が長いと途中で切られるので `out.slice(n)` で分割して取ること。

## 2. Discord パッチノートを読む

パッチノートは**縦長画像スライド**（1枚 ≈ 4129×4817px）。`get_page_text` では読めない。

### 手順
1. `mcp__claude-in-chrome__navigate` でチャンネルURLへ（要ログイン。切れていたらユーザーに依頼する — 認証情報の入力は代行しない）
2. 画像URLは署名付きクエリを含み、ツール出力ではマスクされる。**ページ内で完結させる**オーバーレイ方式を使う:

```js
window.__imgs=[...new Set([...document.querySelectorAll('a[data-role="img"], img')]
  .map(e=>e.href||e.src).filter(s=>/discordapp\.(com|net)\/attachments/.test(s)))];
let ov=document.getElementById('__ov');
if(!ov){ov=document.createElement('div');ov.id='__ov';
  ov.style.cssText='position:fixed;inset:0;z-index:99999;background:#fff;overflow:hidden;display:none';
  ov.innerHTML='<img id="__ovimg" style="position:absolute;left:0;top:0;width:100vw">';
  document.body.appendChild(ov);}
window.__show=async(i,off)=>{const el=document.getElementById('__ovimg');ov.style.display='block';
  if(el.dataset.i!=String(i)){el.src=window.__imgs[i];el.dataset.i=String(i);await el.decode().catch(()=>{});}
  el.style.top=(-(off||0))+'px';
  return {i,file:new URL(window.__imgs[i]).pathname.split('/').pop(),
          w:el.naturalWidth,h:el.naturalHeight,
          scaledH:Math.round(el.naturalHeight*innerWidth/el.naturalWidth),vh:innerHeight};};
window.__hide=()=>{ov.style.display='none'};
window.__imgs.map((s,i)=>i+': '+new URL(s).pathname.split('/').pop()).join('\n')
```

3. `browser_batch` で `__show(i, offset)` → `screenshot` を交互に並べる。
   - 縦長スライドは **offset 0 / 780 / 1500** の3枚でほぼ全域カバー（viewport ≈ 821px）
   - 1バッチに 3〜4画像分（6〜8枚）まで。それ以上は出力が重い
4. **まず offset 0 だけを全画像分スキャン**してセクション見出しを把握 → 関係あるページだけ深掘りする。これが一番効率が良い
5. 読み終わったら `window.__hide()`

### 注意点
- 一覧の画像URLはサムネイルとリンクで**重複**する（`1.png, 1.png, 2.png, 2.png...`）。偶数/奇数インデックスで間引く
- `2_4.png` のような名前は**差し替え版**。元の連番より優先する
- 表紙画像に**隠しクーポンコード**が書かれていることがある（例: `IFOUNDYOU05`）。必ず表紙も見る
- 古いパッチノートはスクロールで遅延ロードが必要。スクロール対象は `div[class*="scroller__36d07"]`
- 大量の `img.decode()` を1回のJSでawaitすると CDP がタイムアウトする。分割すること
- **Discordのタブを閉じるとログインが切れる。** 調査が完全に終わるまで閉じないこと。閉じるとユーザーに再ログインを頼み直すことになる
- 別サイト（@wiki等）を見るときは Discordタブを残したまま別タブを開く

## 3. docs への反映

| 内容 | 反映先 |
|---|---|
| パッチノート要約 | `docs/patchnotes/YYYY-MM-DD.md`（1アップデート1ファイル） |
| 武器の等級・換算値・攻撃力 | `docs/weapon.md` |
| 合成ルール | `docs/synthesis.md` |
| ガチャ確率・累積ボーナス | `docs/gacha.md` |
| 実装アイデア | `docs/ideas.md` |

コードにも反映が必要なもの:
- 新武器 → `src/lib/weapons/types.ts`（`weapons` / `weaponNames` / `synthesisRules`）、`src/lib/weapons/images.ts`、`src/assets/<CODE>.png`、`src/components/weapons/WeaponCatalog.tsx` の `baseWeaponValues`、`src/utils/expectationCalculator.ts` の `synthesisOrder`
- 新ガチャレベル → `src/lib/weapons/gacha.ts`、`types.ts` の `GachaLevel`、`src/lib/weapons/constants.ts` の `bonusThresholds`

反映後は必ず `npm run build` を通す。

## 4. 検証

`requiredL1` と `synthesisRules` の整合性チェック:

```bash
cat > verify.tmp.mts <<'V'
import { weapons, weaponNames, synthesisRules } from './src/lib/weapons/types.ts';
let bad=[];
for (const n of weaponNames){
  const r=synthesisRules[n]; if(!r) continue;
  const expect = weapons[n].requiredL1 * r.count;
  if (Math.abs(expect - weapons[r.output].requiredL1) > 1e-9*Math.max(1,expect))
    bad.push(`${n}x${r.count}->${r.output}: ${expect} vs ${weapons[r.output].requiredL1}`);
}
console.log('inconsistencies:', bad.length ? bad : 'none');
V
npx tsx verify.tmp.mts; rm -f verify.tmp.mts
```

実機確認は `npm run dev`（http://localhost:4321）＋ Chrome拡張のスクリーンショット。

拡張の `resize_window` はビューポートに反映されないことがある。モバイル幅の検証はJSで直接測る:

```js
const main=document.querySelector('main');
main.style.width='375px'; main.style.maxWidth='375px';
await new Promise(r=>setTimeout(r,300));
const sc=document.querySelector('.overflow-x-auto');
const res={ innerScrolls: sc.scrollWidth>sc.clientWidth,
  pageOverflow: document.documentElement.scrollWidth>document.documentElement.clientWidth+1 };
main.style.width=''; main.style.maxWidth=''; JSON.stringify(res)
```

`pageOverflow: false` かつ広い表は `innerScrolls: true` が正しい状態。

## 5. 不明点は推測せず聞く

攻略サイトの数値を誤るとユーザーに実害が出る。以下は**推測で埋めない**:
- 新武器の合成必要本数
- ガチャの内訳確率・累積ボーナス回数

`AskUserQuestion` で、既存パターンからの推定値を第1選択肢にして確認する（ユーザーはプレイヤーなのでゲーム内で確認できる）。
