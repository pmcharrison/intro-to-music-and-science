library(hrep)

library(specdec)
library(ggplot2)

theme_set(theme_classic())

a <- 76 %>% 
  pi_chord() %>% 
  fr_chord() 
  
a %>% 
  wave(num_harmonics = 1, length_sec = 2) %>% 
  play_wav()

b %>% 
  wave(num_harmonics = 1, length_sec = 2) %>% 
  play_wav()


b <- 60 %>% 
  pi_chord() %>% 
  fr_chord() %>% 
  {. * 2 * 5/4} %>% 
  fr_chord()

c(as.numeric(a), as.numeric(b)) %>% 
  fr_chord() %>% 
  wave(num_harmonics = 1, length_sec = 2) %>% 
  play_wav()


c(60, 64, 67) %>% 
  smooth_pc_spectrum() %>% 
  plot(gg = TRUE)
  # scale_x_continuous("Pitch class",
  #                    breaks = 0:12, 
  #                    limits = c(0, 12),
  #                    labels = c(names(PITCH_CLASSES), "C"))


PITCH_CLASSES <- c(
  "C" = 0,
  "C#" = 1,
  "D" = 2,
  "D#" = 3,
  "E" = 4,
  "F" = 5,
  "F#" = 6,
  "G" = 7,
  "G#" = 8,
  "A" = 9,
  "A#" = 10,
  "B" = 11
) 

chords <- list(
  c(60, 64, 67),
  c(60, 65, 69),
  c(59, 62, 67),
  c(60, 64, 67)
) %>% 
  purrr::map(hrep::pi_chord) %>% 
  hrep::vec("pi_chord")

spectral_decay(chords)[[2]] %>% 
  plot(gg = TRUE) + 
  scale_x_continuous("Pitch class",
                     breaks = 0:12, 
                     limits = c(0, 12),
                     labels = c(names(PITCH_CLASSES), "C"))
