library(glue)
library(uuid)

embed_audio <- function(
  src, 
  type = "audio/mpeg",
  attribute = "controls",
  placeholder = "",
  ref = ""
) {
  if (knitr::is_html_output()) {
    dir <- dirname(src)
    file <- basename(src)
    target_dir <- file.path("_book", dir)
    target_path <- file.path(target_dir, file)
    
    R.utils::mkdirs(target_dir)
    file.copy(from = src, to = target_path, overwrite = TRUE)
    
    cat(sprintf("%4$s <audio %3$s><source src='%1$s' type='%2$s'></audio>", src, type, attribute, ref))
  } else cat(placeholder)
  
}

embed_image_with_audio <- function(image, audio, width, caption) {
  ref <- UUIDgenerate()
  cat(sprintf("![**%s** (ref:%s)]({%s}){width='%s'}", caption, ref, image, width))
  cat("\n\n")
  cat(sprintf("(ref:%s)", ref))
}

embed_video <- function(
  src, type = "video/mp4", attribute = "controls",
  placeholder = ""
) {
  if (knitr::is_html_output()) {
    dir <- dirname(src)
    file <- basename(src)
    target_dir <- file.path("_book", dir)
    target_path <- file.path(target_dir, file)
    
    R.utils::mkdirs(target_dir)
    file.copy(from = src, to = target_path, overwrite = TRUE)
    
    cat(sprintf(
      "<video %3$s> <source src='%1$s' type='%2$s'> </video>", src, type, attribute
    ))
  } else cat(placeholder)
}