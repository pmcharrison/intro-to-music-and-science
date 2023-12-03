library(tidyverse)
library(hrep)

theme_set(theme_classic())

get_profile <- function(input) {
  read_delim(input, delim = "\t", 
             col_types = cols(
               pitch_class = col_character(),
               rating = col_double()
             )) %>% 
    mutate(pitch_class = factor(pitch_class, levels = pitch_class))
}

plot_profile <- function(input, output, colour) {
  p <- get_profile(input) %>% 
    ggplot(aes(pitch_class, rating, group = TRUE)) +
    geom_line(colour = colour) + 
    scale_x_discrete(NULL) + 
    scale_y_continuous("Mean rating")
  
  print(p)
  
  ggsave(output, width = 5, height = 3)
}

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

get_milne_profile <- function(context) {
  PITCH_CLASSES %>% 
    map(pi_chord) %>% 
    map(smooth_pc_spectrum) %>% 
    map_dbl(hrep::cosine_similarity, smooth_pc_spectrum(context)) %>% 
    {tibble(pitch_class = names(.), 
            cosine_similarity = as.numeric(.))}
}

plot_profile("input/krumhansl-kessler-major.txt",
             "media/krumhansl-kessler-major.svg", 
             colour = "blue")

plot_profile("input/krumhansl-kessler-minor.txt",
             "media/krumhansl-kessler-minor.svg",
             colour = "red")



context <- pi_chord(c(60, 64, 67))

context %>% sparse_pi_spectrum() %>% plot(gg = TRUE)
context %>% sparse_pc_spectrum() %>% plot(gg = TRUE)
context %>% smooth_pc_spectrum() %>% plot(gg = TRUE)

plot_pitch_images <- function(chord) {
  x_axis <- function(label) {
    scale_x_continuous(if (label) "Pitch class", 
                       breaks = 0:12, 
                       limits = c(0, 12),
                       labels = c(names(PITCH_CLASSES), "C")
    )
  } 
  y_axis <- theme(axis.title.y = element_blank(),
                  axis.text.y = element_blank(),
                  axis.ticks.y = element_blank())
  cowplot::plot_grid(
    chord %>% 
      sparse_pi_spectrum() %>% 
      plot(gg = TRUE, xlab = "Pitch (MIDI)") + 
      scale_x_continuous("Pitch") + 
      y_axis,
    
    chord %>% 
      sparse_pc_spectrum() %>% 
      plot(gg = TRUE) + 
      x_axis(label = TRUE) + 
      y_axis,
    
    chord %>% 
      smooth_pc_spectrum() %>% 
      as_tibble() %>% 
      ggplot(aes(x, y)) + 
      geom_area(fill = "black") + 
      x_axis(label = TRUE) +
      y_axis,
    ncol = 1
  )
}

plot_pitch_images(pi_chord(60))
ggsave("media/pitch-images-60.svg", width = 5, height = 4, scale = 1.25)

plot_pitch_images(pi_chord(c(60, 64, 67)))
ggsave("media/pitch-images-60-64-67.svg", width = 5, height = 4, scale = 1.25)


compare_pitch_images <- function(chords) {
  p <- 
    chords %>% 
    map(smooth_pc_spectrum) %>% 
    map(as_tibble) %>% 
    map2(names(chords), ~ mutate(.x, label = .y)) %>% 
    bind_rows() %>% 
    group_by(label) %>% 
    # mutate(y = y / sd(y)) %>% 
    ungroup() %>% 
    mutate(label = factor(label, levels = names(chords))) %>% 
    ggplot(aes(x, y, colour = label, fill = label)) + 
    # geom_line() +
    geom_area(alpha = 0.5, colour = NA, position = "identity") +
    scale_color_manual(NULL, values = c("black", "red")) + 
    scale_fill_manual(NULL, values = c("black", "red")) + 
    scale_x_continuous("Pitch class", 
                       breaks = 0:12, 
                       labels = c(names(PITCH_CLASSES), "C")
                       ) +
    scale_y_continuous("Salience") +
    theme(legend.direction = "vertical",
          axis.text.y = element_blank(),
          axis.ticks.y = element_blank())
  
  cosine_similarity <- chords %>% map(smooth_pc_spectrum) %>% map(as.numeric) %>%
    set_names(NULL) %>%  do.call(hrep::cosine_similarity, .)
  
  list(
    plot = p, 
    cosine_similarity = cosine_similarity
  )
}

compare_pitch_images(list(
  "C (major triad)" = pi_chord(c(0, 4, 7)),
  "C (single note)" = pi_chord(0)
))

ggsave("media/compare-pitch-images--C-major-triad--C-note.svg", width = 8, height = 4)

compare_pitch_images(list(
  "C (major triad)" = pi_chord(c(0, 4, 7)),
  "D# (single note)" = pi_chord(1)
))

ggsave("media/compare-pitch-images--C-major-triad--C#-note.svg", width = 8, height = 4)

get_profile("input/krumhansl-kessler-major.txt") %>% 
  left_join(get_milne_profile(context = context)) %>% 
  mutate(pitch_class = factor(pitch_class, levels = pitch_class)) %>% 
  pivot_longer(cols = c("rating", "cosine_similarity")) %>% 
  mutate(
    name = recode_factor(name, 
                         rating = "Participant ratings",
                         cosine_similarity = "Milne's psychoacoustic model")
  ) %>% 
  ggplot(aes(x = pitch_class, y = value, colour = name, group = name)) + 
  scale_x_discrete("Pitch class") + 
  scale_y_continuous("Value") + 
  scale_colour_manual(NULL, values = c("blue", "red")) +
  geom_line() + 
  facet_wrap(~ name, ncol = 1, scales = "free_y") + 
  theme(legend.position = "none")

ggsave("media/milne--krumhansler-kessler.png", width = 8, height = 4, dpi = 300)
