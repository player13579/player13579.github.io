# GEM の光学モデル

このアプリは宝石の輝きを観察するための、実時間向け幾何光学シミュレーションです。天然石の鑑別やカット性能の測定には使えません。

## 光の追跡

1. 各ピクセルから視線を逆向きに追跡し、閉じた凸多面体の表面との交点を求めます。
2. 空気から宝石への進入で、スネルの法則 `n₁ sin θ₁ = n₂ sin θ₂` により屈折方向を求めます。
3. s 偏光と p 偏光のフレネル反射率を平均し、表面反射と内部へ進む光の割合を計算します。
4. 内部から出る光を各境界で加算し、残りの反射光を描画品質に応じて最大16・24・40回の内部境界イベントまで追跡します。臨界角 `asin(1/n)` を超えると全反射します。
5. 内部の移動距離ごとに、Beer–Lambert 則 `T = exp(−σd)` で吸収を適用します。
6. 静止中は380–780 nmの24波長、最高精細では48波長を別々に追跡します。CIE 1931等色関数のWyman/Sloan/Shirley近似を使い、線形XYZの空間で積算します。

方向によって変わる輝きはファセットと光路から計算します。面ごとにランダムな色や点滅を与える方法は使っていません。明るい照明は解析的な矩形光源・狭い光源・空の環境光で表現します。スペクトルはCIE標準光D65の表とPlanckの黒体放射式による4200–8500 Kの光源を組み合わせます。明るさの絶対単位は校正していません。

## 形状と精細化

ブリリアントは8方向対称。テーブル1、スター8、ベゼル8、アッパーガードル16、パビリオン主面8、ロワーガードル16、微小なキューレット1の58光学ファセットに、独立した16ガードル面を加えています。テーブル比53.4%、クラウン角34.5°、パビリオン角40.75°、ガードル厚2%を使います。

エメラルドカットは縦横比1.53の隅切り長方形に、クラウン3段とパビリオン3段を設けた58平面。オーバルはブリリアントの接続構造を保った縦横比1.50のアフィン変換です。オーバルのファセット角はこの伸長変換による近似で、商用カットの最適化結果ではありません。

| 品質 | 可視光の波長数 | 積算サンプル数 | 内部境界の上限 |
| --- | ---: | ---: | ---: |
| 軽快 | 24 | 32 | 16 |
| 高精細 | 24 | 64 | 24 |
| 最高精細 | 48 | 128 | 40 |

各ピクセルで3波長ずつ循環して追跡し、サブピクセル位置をずらしたサンプルを積算します。波長と位置の周期の相関を弱めています。操作と自動回転の間は610・550・460 nmのRGB高速プレビュー（最大12境界）です。静止すると積算をやり直し、波長の完全な周期が揃った時点で表示を更新します。

対応GPUではRGBA16Fで線形XYZを保持し、明るい反射光を保存します。カメラのにじみは、明部の一部を3段階のガウス分布へ再分配する近似です。光量を足すだけのグローではありませんが、閾値を持つ表示効果であり、実在レンズの測定PSFや回折計算ではありません。最後にXYZを線形sRGBに変換し、フィルミックなトーンマッピングとsRGBの区分伝達関数を適用します。

## 素材と分散

分散式は `n(λ) = A + B/λ²`。`nD` とアッベ数 `VD = (nD−1)/(nF−nC)` から係数を導出します。F線486.13 nm、D線589.30 nm、C線656.27 nmを使用します。UI の「分散」表示は **nF−nC** です。宝石学で一般的なB線とG線の差とは定義が異なります。

| 素材 | nD | VD | 扱い |
| --- | ---: | ---: | --- |
| ダイヤモンド | 2.417 | 55.3 | 可視域の代表値 |
| サファイア | 1.765 | 72.2 | 普通光・異常光の違いを省いた代表値 |
| エメラルド | 1.580 | 約71 | 宝石学的分散0.014をCauchy式で換算した近似 |
| ルビー | 1.765 | 72.2 | 同じコランダムであるサファイアの代表分散を使用 |

「分散 1.0 ×」はこれらのモデル値です。0では波長依存を取り除き、2では `nD` からの波長ごとの差を2倍にします。屈折率と臨界角の表示はD線の値です。

色吸収係数は見え方を調整した非負のRGB係数を460・550・610 nmの間で補間した近似スペクトルで、特定試料の測定値ではありません。宝石の個体差・不純物量は表現していません。

## 近似と制限

- 可視光の離散波長と解析的な等色関数による近似です。天然石の分光測色を再現した測定器ではありません。CIE D65の数値表を5 nm間隔で収録・補間し、Yの積分値で共通の正規化を行います。XYZ各成分を独立に白へ合わせる補正はしていません。
- 屈折率は等方性として扱います。サファイア・ルビー・エメラルドの複屈折や多色性は省略しています。
- カットは理想的に対称な閉じた凸多面体です。実在の個体を3Dスキャンした形状ではありません。輪郭のガードルも有限個の平面で近似しています。
- 理想的な滑らかな表面です。内包物、表面粗さ、回折、蛍光、床へのコースティクス（集光模様）は実装していません。
- 品質ごとの上限または小さな残存光量で追跡を打ち切るため、長い光路の寄与が失われます。
- 背景は観察用の暗い背景で、宝石が見る照明環境そのものの画像ではありません。
- 品質と画面の大きさに応じて描画解像度の上限を設けています。浮動小数点の描画に非対応の場合はRGBA8の互換描画となり、強い光のダイナミックレンジが失われます。

## 参考資料

- [Physically Based Rendering, 4th ed. — Dielectric BSDF](https://www.pbr-book.org/4ed/Reflection_Models/Dielectric_BSDF): 誘電体境界の反射・透過、フレネル係数、屈折。
- [OpenStax — Refraction](https://openstax.org/books/physics/pages/16-2-refraction): スネルの法則と全反射。
- [Edmund Optics — Understanding Optical Windows](https://www.edmundoptics.com/knowledge-center/application-notes/optics/understanding-optical-windows/): 屈折率とアッベ数の定義、ダイヤモンドを含む光学素材の代表値。
- [Edmund Optics — Sapphire Windows](https://www.edmundoptics.ca/f/PdfExport/39787): サファイアの代表屈折率・アッベ数。
- [GIA — Diamond](https://www.gia.edu/diamond): ダイヤモンドの代表的な屈折率。
- [GIA — Multi-elemental Diffused, Melt-Grown Synthetic Sapphire](https://www.gia.edu/gems-gemology/spring-2017-labnotes-multi-elemental-diffused-melt-grown-synthetic-sapphire): コランダムの測定屈折率と複屈折。
- [GIA — Three-Phase Inclusions in Emerald and Their Impact on Origin Determination](https://www.gia.edu/gems-gemology/summer-2014-saeseaw-three-phase-inclusions-emerald): エメラルドの産地と屈折率範囲。
- [International Gem Society — Gemstone Dispersion](https://www.gemsociety.org/article/gemstone-dispersion/): 宝石学におけるB線686.7 nmとG線430.8 nmの分散の定義。
- [LibreTexts Gemology — Emerald](https://geo.libretexts.org/Bookshelves/Geology/Gemology/16%3A_Gemstones/16.04%3A_Beryl/16.4.03%3A_Emerald): エメラルドの宝石学的分散0.014。
- [GIA — How to Select a Round Diamond Engagement Ring](https://4cs.gia.edu/en-us/blog/how-to-select-round-diamond-engagement-ring/): ラウンド・ブリリアントのファセット群。
- [GIA — Diamond Cut](https://4cs.gia.edu/en-us/diamond-cut/): 57/58面とキューレット。
- [GIA — Modeling the Appearance of the Round Brilliant Cut Diamond](https://www.gia.edu/doc/Modeling-the-Appearance-of-the-Round-Brilliant-Cut-Diamond-An-Analysis-of-Brilliance.pdf): クラウン、パビリオン、テーブル比による外観。
- [GIA — Enumerating Diamond Cuts](https://www.gia.edu/gia-news-research/enumerating-diamond-cuts): ガードルを含むダイヤモンドの面の数え方。
- [Wyman, Sloan & Shirley — Simple Analytic Approximations to the CIE XYZ Color Matching Functions](https://jcgt.org/published/0002/02/01/paper.pdf): 使用した等色関数の近似式。
- [CIE — Standard Illuminant D65, DOI 10.25039/CIE.DS.hjfjmt59](https://www.cie.co.at/datatable/cie-standard-illuminant-d65): 昼光スペクトルの数値表。CIE 2019、International Commission on Illumination。
- [W3C — sRGB](https://www.w3.org/Graphics/Color/sRGB): XYZ/sRGB変換とsRGB伝達関数。
