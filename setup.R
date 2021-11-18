library(glue)
library(uuid)
library(magrittr)

embed_audio <- function(
  audio, 
  type = "audio/mpeg",
  controls = TRUE,
  allow_download = FALSE,
  placeholder = "",
  ref = ""
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
    
    cat(sprintf("%4$s <audio %3$s><source src='%1$s' type='%2$s'></audio>", audio, type, attributes, ref))
  } else cat(placeholder)
  
}

embed_image <- function(image, title = NULL, width = NULL, credit = NULL, caption_ref = NULL) {
  caption <- sprintf("**%s**", title)
  if (!is.null(credit)) {
    caption <- paste0(caption, " ", "Credit: ", credit)
  }
  if (!is.null(caption_ref)) {
    caption <- paste0(caption, " ", text_reference(caption_ref))
  }
  width_str <- if (is.null(width)) "" else sprintf("{width='%s'}", width)
  cat(sprintf("![%s](%s)%s", caption, image, width_str))
}

text_reference <- function(ref) {
  sprintf("(ref:%s)", ref)
}

embed_image_with_audio <- function(image, audio, width, title, credit = NULL, ...) {
  ref <- UUIDgenerate()
  embed_image(image, title, width, credit, caption_ref = ref)
  cat("\n\n")
  cat(text_reference(ref))
  embed_audio(audio, ...)
}

embed_video <- function(
  video, 
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
  embed_image("images/1x1.png")
  
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
  
  cat(sprintf(
    "<video %s> <source src='%s' type='%s'> </video>", attributes, video, type
  ))
} 
# else cat(placeholder)
# }