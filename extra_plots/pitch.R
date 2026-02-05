library(tidyverse)

# Reverse sawtooth wave spectrogram
# Period: 0.005 s -> Fundamental frequency: 200 Hz
# Harmonics at n * 200 Hz with amplitude 1/n

fundamental_freq <- 200  # Hz
n_harmonics <- 25
time_duration <- 2  # seconds

# Create data for the spectrogram
# For a stationary signal, amplitude is constant across time
spectrogram_data <- tibble(
  harmonic = 1:n_harmonics,
  frequency = harmonic * fundamental_freq,
  amplitude = 1 / harmonic
)

# Create the spectrogram plot
p <- ggplot(spectrogram_data, aes(y = frequency)) +
  geom_segment(
    aes(x = 0, xend = time_duration, yend = frequency, color = amplitude),
    linewidth = 0.5
  ) +
  scale_x_continuous(
    name = "Time (seconds)",
    breaks = seq(0, 2, by = 0.5),
    limits = c(0, 2),
    expand = c(0.02, 0)
  ) +
  scale_y_continuous(
    name = "Frequency (Hz)",
    breaks = seq(0, 5000, by = 1000),
    limits = c(0, 5000),
    expand = c(0.02, 0)
  ) +
  scale_color_viridis_c(name = "Amplitude", option = "inferno") +
  theme_classic() +
  theme(
    panel.background = element_rect(fill = "black"),
    axis.text = element_text(size = 10),
    axis.title = element_text(size = 11),
    legend.position = "bottom"
  )

print(p)

ggsave("extra_plots/spectrogram.png", width = 4, height = 4, dpi = 300)

