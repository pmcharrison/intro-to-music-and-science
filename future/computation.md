It would be good to write another chapter on practical approaches to computational modelling, but there wasn't space in the current iteration. Here is some archive text that might be useful for such a chapter.

## Modelling strategies

You now have a good overview of two

### Creating models

Intuitive:

-   Just write down what we think happens

Marr:

-   What problem is the mind trying to solve?

-   What algorithm is used to implement that solution?

-   How is that algorithm implemented in the brain?

Rational observer:

-   Derive the optimal solution to a task

-   Compare this to the brain

Bounded rationality:

-   Like rational observer approach, but incorporating processing constraints

Learning by imitation:

-   Machine learning

### Comparing models

-   Generate predictions

-   Correlation and regression

### Improving models

-   Optimisation

## 

## Archive

### Theory evaluation

### Theory development

to support one of three research tasks: theory development, theory evaluation, and prediction

fits into one of three stages of the research pipeline: theory development, theory evaluation, or prediction generation.

-   Theory development

-   Theory evaluation

-   Prediction generation

Computer models have two main applications in psychological research. When the problem domain is not yet well understood, computer models can play an important role in *theory development*, helping researchers to choose between competing explanations of a phenomenon. Once the problem domain becomes well-understood, computer models then become valuable for *prediction generation*, allowing the researcher to predict the outcome of an experiment without actually running it.

### Computer models for theory development

We begin this process by identifying an interesting psychological phenomenon which we wish to study. For example, we might be interested in studying listeners' perception of emotion in melodies.

The next step is to identify a set of candidate psychological mechanisms for the phenomenon. These candidate mechanisms will often be derived from previous literature, but they may also be derived from our own intuitions. These candidate mechanisms may or may not be mutually exclusive. In the case of melodic emotion perception, we might hypothesise multiple non-exclusive mechanisms, including the recognition of ascending versus descending contours, major versus minor modes, legato versus staccato articulation, and so on.

We then proceed by implementing computer models that simulate these mechanisms. Each computer model will typically be a piece of computer software that takes a musical stimulus as an input and simulates the psychological processing of that stimulus. The output will typically be one or more numbers that capture the outcome of the process. For example, a simple mode recognition algorithm might return 1 for major-key melodies and 0 for minor-key melodies.

In the next step, we design an experiment for probing these models.

For example, we might decide to study *key finding*, the process by which a listener identifies the key of a g

1.  **Identify an interesting psychological phenomenon.** For example, we might be interested in studying listeners' perception of emotion in melodies.

2.  **Identify candidate psychological mechanisms for this phenomenon.** These candidate mechanisms will often be derived from previous literature, but they may also be derived from our own intuitions. These candidate mechanisms may or may not be mutually exclusive. In the case of melodic emotion perception, we might hypothesise multiple non-exclusive mechanisms, including the recognition of ascending versus descending contours, major versus minor modes, legato versus staccato articulation, and so on.

3.  **Implement computer models that simulate these mechanisms.** Each computer model will typically be a piece of computer software that takes a musical stimulus as an input and simulates the psychological processing of that stimulus. The output will typically be one or more numbers that capture the outcome of the process. For example, a simple mode recognition algorithm might return 1 for major-key melodies and 0 for minor-key melodies.

4.  **Design an experiment for probing these models.** The experiment could simply comprise a set of musical stimuli to be presented to the participant.

5.  **Generate model predictions.** This will typically involve running the models on each stimulus and recording the models' outputs.

6.  This stimulus set should be designed to systematically probe the different computer models.

Suppose we have identified a problem domain which we want to study, for example *key finding*, the process by which a listener identifies the key of a given musical passage.
