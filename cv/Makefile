# Build the CV and install it into the site's public directory.
#
#   make          compile and install
#   make cv.pdf   compile only
#   make clean    remove all build artifacts (including cv.pdf)
#
# Requires XeLaTeX. Fonts (TeX Gyre Pagella, Fandol) ship with TeX Live, so
# no system font installation is needed.

TARGET := ../public/docs/Lin-Ren-CV.pdf

.PHONY: all install clean

all: install

cv.pdf: cv.tex
	latexmk -xelatex -interaction=nonstopmode cv.tex

# The published artifact must be committed: Cloudflare Pages builds the site
# with pnpm and has no LaTeX toolchain, so it cannot regenerate the PDF.
install: cv.pdf
	cp cv.pdf $(TARGET)
	@echo "installed -> $(TARGET)  (remember to commit it)"

clean:
	latexmk -C
