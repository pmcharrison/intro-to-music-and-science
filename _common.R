# example R options set globally
options(width = 60)

# Keep UTF-8 so non-ASCII credits/captions aren't escaped to <U+XXXX>
# when the process locale is C (common in non-interactive renders / CI).
if (!grepl("UTF-8|utf8", Sys.getlocale("LC_CTYPE"), ignore.case = TRUE)) {
  for (loc in c("C.UTF-8", "en_US.UTF-8", "UTF-8")) {
    suppressWarnings(Sys.setlocale("LC_ALL", loc))
    if (grepl("UTF-8|utf8", Sys.getlocale("LC_CTYPE"), ignore.case = TRUE)) break
  }
}

# example chunk options set globally
knitr::opts_chunk$set(
  comment = "#>",
  collapse = TRUE
  )

# PDF/ebook screenshots need integer viewport sizes; "100%" out.width
# would otherwise be passed through to webshot2/chromote and fail.
if (!knitr::is_html_output()) {
  knitr::opts_chunk$set(
    screenshot.opts = list(vwidth = 800, vheight = 700)
  )
}
