library(glue)
library(uuid)
library(magrittr)

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

embed_image <- function(image, title = NULL, width = NULL, credit = NULL, 
                        before_caption = NULL,
                        after_caption = NULL) {
  caption <- 
    c(
      before_caption,
      sprintf("**%s**", title),
      if (!is.null(credit)) paste0("Credit: ", credit),
      after_caption
    ) %>% 
    paste(collapse = " ")
  width_str <- if (is.null(width)) "" else sprintf("{width='%s'}", width)
  cat(sprintf("![%s](%s)%s", caption, image, width_str))
}

text_reference <- function(ref) {
  sprintf("(ref:%s) ", ref)
}

embed_image_with_audio <- function(image, audio, width, title, credit = NULL, ...) {
  ref <- UUIDgenerate()
  embed_image(image, title, width, credit, after_caption = text_reference(ref))
  cat("\n\n")
  cat(text_reference(ref))
  cat(" ")
  embed_audio(audio, ...)
}

embed_video <- function(
  video, 
  title,
  credit,
  type = "video/mp4", 
  controls = TRUE,
  autoplay = FALSE,
  muted = FALSE,
  loop = FALSE,
  width = NULL
) {
  if (autoplay && !muted) {
    stop("Autoplay only works if muted is TRUE")
  }
  # if (knitr::is_html_output()) {
  dir <- dirname(video)
  file <- basename(video)
  target_dir <- file.path("_book", dir)
  target_path <- file.path(target_dir, file)
  
  R.utils::mkdirs(target_dir)
  file.copy(from = video, to = target_path, overwrite = TRUE)
  
  # To make the formatting work how we want, we put an empty image,
  # and put the video inside the caption for that image.
  ref <- UUIDgenerate()
  embed_image("images/1x1.png", title = title, credit = credit, before_caption = text_reference(ref))
  
  cat("\n\n")
  
  attributes <- 
    c(
      if (controls) "controls",
      if (autoplay) "autoplay",
      if (muted) "muted",
      if (loop) "loop",
      if (!is.null(width)) sprintf("width=%s", width)
    ) %>% 
    paste(collapse = " ")
  
  cat(text_reference(ref))
  cat(sprintf(
    "<video %s> <source src='%s' type='%s'> </video>", attributes, video, type
  ))
} 
# else cat(placeholder)
# }