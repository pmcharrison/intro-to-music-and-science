library(glue)
library(uuid)
library(magrittr)

knitr::opts_chunk$set(out.width = "100%")

if (curl::has_internet() && (interactive() || !exists("downloaded_paperpile_bib"))) {
  curl::curl_download("https://paperpile.com/eb/ExZhPTapyS", "paperpile.bib")
  downloaded_paperpile_bib <- TRUE
}

embed_audio <- function(
  audio, 
  type = "audio/mpeg",
  controls = TRUE,
  allow_download = FALSE,
  placeholder = ""
) {
  if (!knitr::is_html_output()) {
    cat(placeholder)
    return(invisible())
  }

  dir <- dirname(audio)
  file <- basename(audio)
  target_dir <- file.path("_book", dir)
  target_path <- file.path(target_dir, file)
  
  R.utils::mkdirs(target_dir)
  file.copy(from = audio, to = target_path, overwrite = TRUE)
  
  attributes <- c(
    if (controls) "controls",
    if (!allow_download) "controlsList='nodownload'"
  ) %>% 
    paste(collapse = " ")
  
  cat(sprintf("<audio %3$s style='display: block; margin-top: 10px'><source src='%1$s' type='%2$s'></audio>", audio, type, attributes))
}

figure_caption <- function(title = NULL, info = NULL, credit = NULL,
                           before_caption = NULL, after_caption = NULL) {
  c(
    before_caption,
    if (!is.null(title)) sprintf("**%s**", title),
    info,
    if (!is.null(credit)) paste0("Credit: ", credit),
    after_caption
  ) %>%
    Filter(Negate(is.null), .) %>%
    paste(collapse = " ")
}

embed_image <- function(image, title = NULL, width = NULL, info = NULL, credit = NULL, 
                        before_caption = NULL,
                        after_caption = NULL) {
  caption <- figure_caption(title, info, credit, before_caption, after_caption)
  width_str <- if (is.null(width)) "" else sprintf("{width='%s'}", width)
  # `<br>` is HTML-only; it would otherwise leak into the PDF as literal text.
  suffix <- if (knitr::is_html_output()) "\n\n<br>\n" else "\n\n"
  cat(sprintf("![%s](%s)%s%s", caption, image, width_str, suffix))
}

text_reference <- function(ref) {
  sprintf("(ref:%s) ", ref)
}

embed_image_with_audio <- function(image, audio, width, title, info = NULL, credit = NULL, ...) {
  if (!knitr::is_html_output()) {
    # Audio players and bookdown text-references are HTML features; in PDF just
    # show the image with a normal caption.
    embed_image(image, title, width, info, credit)
    return(invisible())
  }

  ref <- UUIDgenerate()
  embed_image(image, title, width, info, credit, after_caption = text_reference(ref))
  cat("\n\n")
  cat(text_reference(ref))
  cat(" ")
  embed_audio(audio, ...)
}

embed_youtube_video <- function(
  video_id,
  title,
  info = NULL,
  credit = NULL,
  start_at = 0,
  width = 560,
  height = 315
) {
  if (start_at != round(start_at))  stop("start_at must be an integer")
  url <- sprintf("https://www.youtube.com/watch?v=%s", video_id)
  if (start_at > 0) url <- paste0(url, "&t=", start_at)

  if (!knitr::is_html_output()) {
    cat(figure_caption(title, info, credit))
    cat(sprintf(" ([Watch on YouTube](%s)).\n\n", url))
    return(invisible())
  }

  sprintf(
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/%s?start=%s" style="display: block; margin-bottom: 25px" title="%s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    video_id,
    start_at,
    title
  ) %>% 
    embed_with_caption(title, info, credit)
}

embed_with_caption <- function(
  html,
  title,
  info = NULL,
  credit = NULL
) {
  if (!knitr::is_html_output()) {
    cat(figure_caption(title, info, credit))
    cat(" *(Media available in the online version of these notes.)*\n\n")
    return(invisible())
  }

  # To make the formatting work how we want, we put an empty image,
  # and put the video inside the caption for that image.
  ref <- UUIDgenerate()
  embed_image("images/1x1.png", title = title, info = info, credit = credit, before_caption = text_reference(ref))
  
  cat("\n\n")
  
  cat(text_reference(ref))
  cat(html)
}
  
embed_video <- function(
  video, 
  title,
  info = NULL,
  credit = NULL,
  type = "video/mp4", 
  controls = TRUE,
  autoplay = FALSE,
  muted = FALSE,
  loop = FALSE,
  width = NULL,
  external_host = FALSE
) {
  if (autoplay && !muted) {
    stop("Autoplay only works if muted is TRUE")
  }

  if (!knitr::is_html_output()) {
    cat(figure_caption(title, info, credit))
    cat(" *(Video available in the online version of these notes.)*\n\n")
    return(invisible())
  }

  if (!external_host) {
    dir <- dirname(video)
    file <- basename(video)
    target_dir <- file.path("_book", dir)
    target_path <- file.path(target_dir, file)
    
    R.utils::mkdirs(target_dir)
    file.copy(from = video, to = target_path, overwrite = TRUE)
  }
  
  attributes <- 
    c(
      if (controls) "controls",
      if (autoplay) "autoplay",
      if (muted) "muted",
      if (loop) "loop",
      if (!is.null(width)) sprintf("width=%s", width)
    ) %>% 
    paste(collapse = " ")
  
  html <- sprintf(
    "<video %s> <source src='%s' type='%s'> </video>", attributes, video, type
  )
  
  embed_with_caption(html, title, info, credit)
}