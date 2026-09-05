# GEM の光学モデル

このアプリは宝石の輝きを観察するための、実時間向け幾何光学シミュレーションです。天然石の鑑別やカット性能の測定には使えません。

## 光の追跡

1. 各ピクセルから視線を逆向きに追跡し、閉じた凸多面体の表面との交点を求めます。
2. 空気から宝石への進入で、スネルの法則 `n₁ sin θ₁ = n₂ sin θ₂` により屈折方向を求めます。
3. s 偏光と p 偏光のフレネル反射率を平均し、表面反射と内部へ進む光の割合を計算します。
4. 内部から出る光を各境界で加算し、残りの反射光を最大12回の内部境界イベントまで追跡します。臨界角 `asin(1/n)` を超えると全反射します。
5. 内部の移動距離ごとに、Beer–Lambert 則 `T = exp(−σd)` で吸収を適用します。
6. 赤610 nm・緑550 nm・青460 nmを別々に追跡し、波長によって異なる方向から照明を受けます。

方向によって変わる輝きはファセットと光路から計算します。面ごとにランダムな色や点滅を与える方法は使っていません。明るい照明は解析的な矩形光源・狭い光源・空の環境光で表現し、表示時にトーンマッピングとガンマ変換を行います。

## 素材と分散

分散式は `n(λ) = A + B/λ²`。`nD` とアッベ数 `VD = (nD−1)/(nF−nC)` から係数を導出します。F線486.13 nm、D線589.30 nm、C線656.27 nmを使用します。UI の「分散」表示は **nF−nC** です。宝石学で一般的なB線とG線の差とは定義が異なります。

| 素材 | nD | VD | 扱い |
| --- | ---: | ---: | --- |
| ダイヤモンド | 2.417 | 55.3 | 可視域の代表値 |
| サファイア | 1.765 | 72.2 | 普通光・異常光の違いを省いた代表値 |
| エメラルド | 1.580 | 約71 | 宝石学的分散0.014をCauchy式で換算した近似 |
| ルビー | 1.765 | 72.2 | 同じコランダムであるサファイアの代表分散を使用 |

「分散 1.0 ×」はこれらのモデル値です。0では波長依存を取り除き、2では `nD` からの波長ごとの差を2倍にします。屈折率と臨界角の表示はD線の値です。

色吸収係数は見え方を調整した非負のRGB係数で、特定試料の測定スペクトルではありません。宝石の個体差・不純物量は表現していません。

## 近似と制限

- 3波長のRGB近似です。全可視スペクトルを積分した色測定値ではありません。
- 屈折率は等方性として扱います。サファイア・ルビー・エメラルドの複屈折や多色性は省略しています。
- カットは閉じた凸多面体の近似です。ファセット数はラウンドとオーバル62、エメラルド42で、市販の厳密な標準カットの寸法ではありません。
- 理想的な滑らかな表面です。内包物、表面粗さ、回折、蛍光、床へのコースティクス（集光模様）は実装していません。
- 12回の上限または小さな残存光量で追跡を打ち切るため、長い光路の寄与が失われます。
- 背景は観察用の暗い背景で、宝石が見る照明環境そのものの画像ではありません。
- 自動回転時は端末負荷に応じて描画解像度を調整します。

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
