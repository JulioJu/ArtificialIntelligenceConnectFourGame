gen:
	pandoc rapport.md --pdf-engine=xelatex --filter pandoc-citeproc -f markdown+footnotes+smart+header_attributes+link_attributes+superscript+pipe_tables --template ./eisvogel.tex --listings --number-sections -o rapport.pdf && evince rapport.pdf
download:
	wget https://raw.githubusercontent.com/Wandmalfarbe/pandoc-latex-template/2c3810b25d07d29ed64fe5d679abce67ad590a36/eisvogel.tex
	patch < eisvogel1_2_1.patch
	wget https://raw.githubusercontent.com/citation-style-language/styles/master/chicago-fullnote-bibliography.csl
