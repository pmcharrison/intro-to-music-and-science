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
  if (knitr::is_html_output()) {
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
  } else cat(placeholder)
  
}

embed_image <- function(image, title = NULL, width = NULL, info = NULL, credit = NULL, 
                        before_caption = NULL,
                        after_caption = NULL) {
  caption <- 
    c(
      before_caption,
      sprintf("**%s**", title),
      info,
      if (!is.null(credit)) paste0("Credit: ", credit),
      after_caption
    ) %>% 
    paste(collapse = " ")
  width_str <- if (is.null(width)) "" else sprintf("{width='%s'}", width)
  cat(sprintf("![%s](%s)%s\n\n<br>\n", caption, image, width_str))
}

text_reference <- function(ref) {
  sprintf("(ref:%s) ", ref)
}

embed_image_with_audio <- function(image, audio, width, title, info = NULL, credit = NULL, ...) {
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
  # if (knitr::is_html_output()) {
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
# else cat(placeholder)
# }