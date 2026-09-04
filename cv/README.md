# CV

LaTeX source for the CV linked from [/intro/](https://blog.homura.work/intro/).

## 编译

```bash
cd cv
make            # 编译并安装到 ../public/docs/Lin-Ren-CV.pdf
make clean      # 清掉所有中间产物
```

需要 XeLaTeX（中文用到 `xeCJK`）。正文字体 TeX Gyre Pagella、中文字体 Fandol
都是 TeX Live 自带的，且按**文件名**加载而非家族名，所以不依赖 fontconfig，
在任何 TeX Live 环境（包括 Overleaf）都能直接编译。

## 两份 PDF 的关系

| 路径 | 是否入库 | 说明 |
|---|---|---|
| `cv/cv.pdf` | ❌ 已 gitignore | 编译中间产物 |
| `public/docs/Lin-Ren-CV.pdf` | ✅ 必须提交 | 线上实际下载的那份 |

**改完 `cv.tex` 一定要跑 `make` 并提交 `public/docs/Lin-Ren-CV.pdf`。**
Cloudflare Pages 只跑 `pnpm run build`，环境里没有 LaTeX，不会替你重新编译。
只提交 `.tex` 而忘了提交 PDF，线上仍然是旧版本，且不会报错。

## 内容同步

CV 的内容和 `src/content/spec/intro.md` 是**手工保持一致**的，没有自动同步。
改了论文列表记得两边都改。
