embed_audio <- function(src, type = "audio/mpeg", attribute = "controls",
                        placeholder = "") {
  if (knitr::is_html_output()) {
    dir <- dirname(src)
    file <- basename(src)
    target_dir <- file.path("_book", dir)
    target_path <- file.path(target_dir, file)
    
    R.utils::mkdirs(target_dir)
    file.copy(from = src, to = target_path, overwrite = TRUE)
    
    cat(sprintf("<audio %3$s>
               <source src='%1$s' type='%2$s'>
            </audio>", src, type, attribute))
  } else cat(placeholder)
  
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