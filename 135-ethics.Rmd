---
editor_options: 
  markdown: 
    wrap: 72
---

# Ethics

The way that we do scientific research has impact on the people around
us. Some of these impacts are positive: for example, our research might
prompt the development of new treatments for clinical disorders, or
instigate improved educational practices in schools, or spawn new
technologies for helping people discover new music. However, some of
these impacts might conversely be negative: certain experiments might
cause psychological distress in our participants, might violate their
privacy in untoward ways, or might even cause detriment to people's
physical health. The goal of research ethics is to systematically
evaluate both these positive and negative potential impacts, and thereby
guide our research programmes to maximise the positive and minimise the
negative.

Ethics is relevant to many aspects of scientific and non-scientific
research. In the context of 'music and science', our ethical best
practices are mostly inherited from best practices in psychological
research. As in psychology, the ethical issues we most commonly have to
worry about are issues to do with the participants who take part in our
experiments, most commonly humans but also sometimes animals. Ethical
issues do also crop up in other areas though, for example when we are
constructing musical corpora that deal with music from different
cultures.

## Guiding principles

Psychologists across the world are expected to guide their work towards
certain ethical principles. One popular codification of these principles
has been established by the American Psychological Association (APA) and
can be browsed [on their website](https://www.apa.org/ethics/code).
These principles can be briefly summarised as follows:

**Beneficence and Nonmaleficence.** We should strive to achieve good and
to avoid doing harm.

**Fidelity and Responsibility.** We should act professionally and
responsibly, being aware of the trust that society puts in us.

**Integrity.** We should be honest and truthful when we communicate to
participants and the wider public.

**Justice.** We should try to conduct research that benefits all people
equally.

**Respect for People's Rights and Dignity.** We should respect people's
rights and dignity, recognising in particular vulnerable populations who
have limited capacity for autonomous decision-making.

## What this means in practice

These principles have certain salient implications for the way that we
conduct music psychology research projects.

### Good versus harm

Medical research often has to balance significant positive outcomes with
significant potential negative outcomes. An experimental drug might have
the potential to cure cancer, but simultaneously have the potential to
cause dangerous side effects.

Music psychology rarely has to deal with such high stakes. Much of our
research has no direct positive outcome on individuals; its primary
impact is rather just a general improvement of our foundational
knowledge of psychology. Fortunately, our research rarely has much of a
negative outcome either: many of our experiments simply involve
listening to a series of musical sounds and making some responses, a
situation where the most significant side-effect is slight boredom.

When justifying the ethical appropriateness of music psychology studies,
we therefore generally do not have to worry about arguing that our
research has significant direct positive impact for participants: the
stakes are typically low, and so a general contribution to knowledge is
sufficient. However, we do have to keep an eye out for situations where
harm might come about. Examples include:

-   Loud stimuli that might cause hearing damage.
-   Long-term repetitive movements that might cause physical problems
    such as repetitive strain injury.
-   Negative reactions to drugs (e.g. from excessive consumption of
    alcohol).
-   Negative reactions to neuroimaging techniques (e.g. transcranial
    magnetic stimulation).

One strategy is to eliminate the possibility of such negative effects
altogether, for example by avoiding running any research using drugs or
neuroimaging techniques. However, it is often possible to retain these
elements but instead implement measures either for reducing the
probability of adverse effects or by mitigating their severity if they
do occur. For example, an experiment involving drugs might establish a
standardised procedure for obtaining medical assistance should an
adverse reaction occur.

### Fairness in interventional research

Some music psychology studies involve long-term interventions. For
example, one might implement an educational intervention where a random
selection of students receive six months of music lessons. This
intervention might be considered to be a 'positive' intervention in the
sense that it involves a 'gift' to certain participants. In this
context, it is important to reflect on the 'Justice' principle outlined
above. Does your experiment differentially benefit particular subgroups
of the population? Does it reinforce existing disparities in privilege
that already exist in that population? If so, it is worth considering
whether the experiment might be adjusted to achieve a more equitable
outcome.

### Privacy

Many legal systems around the world include the notion of a 'right to
privacy'. Privacy means that an individual has control over the use of
their personal information. In the UK and Europe, the right to privacy
is upheld by the General Data Protection Regulation (GDPR), which
establishes a range of principles constraining the use of personal
information by third parties. Institutions are under a serious
obligation to upheld the requirements of the GDPR, and can be subject to
very large fines for violations of it. When we conduct psychology
experiments, we must likewise work hard to make sure that we adhere to
the GDPR's requirements.

The GDPR is complex, and learning its requirements typically involves
taking not insignificant training courses. These requirements involve
standardised procedures and expectations for how personal data is
accessed, shared, and deleted. For example, the GDPR restricts the
transfer of personal data outside the European Union to countries which
do not satisfy its own levels of privacy guarantees (e.g. the US). Such
principles can seem at the face of it at odds with other scientific
goals such as the desire to share one's datasets alongside academic
publications.

Fortunately, there are some basic steps we can take that can simplify
all of this for us in the majority of cases (note: I am not a lawyer,
this is not legal advice...):

**Avoid requesting sensitive personal data.** [EU
law](https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/legal-grounds-processing-data/sensitive-data/what-personal-data-considered-sensitive_en#:~:text=personal%20data%20revealing%20racial%20or,sex%20life%20or%20sexual%20orientation.)
considers the following personal data to be 'sensitive', and hence
subject to specific processing conditions. If you can, avoid collecting
such data, that way you don't have to worry about these additional
conditions.

-   Personal data revealing racial or ethnic origin, political opinions,
    religious or philosophical beliefs;

-   Trade-union membership;

-   Genetic data, biometric data processed solely to identify a human
    being;

-   Health-related data;

-   Data concerning a person's sex life or sexual orientation.

**Avoid requesting personally identifying information unless you need
to.** Datasets only become subject to GDPR regulations if they contain
personally identifying information. It is therefore helpful to avoid
collecting such information where possible. Personally identifying
information is information that could theoretically be used to identify
individual participants, for example:

-   Names

-   Dates of birth

-   Postcodes

-   Images or video recordings which include the participant's face

-   Audio recordings of the participant's voice

-   Mechanical Turk Worker IDs, Prolific Participant IDs, etc.

**Non-anonymous datasets should only be stored on local, secure
machines.** Datasets that can be linked to individuals via personally
identifying information may be termed 'non-anonymous datasets'.
Sometimes it is necessary to store non-anonymous datasets temporarily
for practical purposes, for example administering payments to
participants. In such cases, you should:

-   Only store your data on a local machine (e.g. a laptop), or a
    machine known to be in the EU (e.g. a remote web server). Do not
    allow that data to pass outside the EU while it is still
    non-anonymous.

-   Make sure your machine is secure from intrusion. This means a few
    best practices: don't leave your computer unattended, give it a
    secure password, make sure the hard drive is encrypted. Only named
    collaborators should have access to the data.

-   Institute a workflow which ensures that such information is deleted
    once it has served its required use. You should not retain such data
    indefinitely.

**Anonymise your datasets as soon as possible.** To anonymise data means
to remove all of its personally identifying information (names, dates of
birth, postcodes etc.). Once a dataset is anonymous, the GDPR rules no
longer apply. This means you can then relax your practices about data
management, for example uploading it to open-access repositories.

### Informed consent

Participants should provide informed consent before participating in
your study. For consent to be 'informed', the participant must have been
told about all ethically relevant aspects of the study, including
potential positive impacts, potential negative impacts, what will happen
to them in the experiment, etc. This consent should be recorded in a
concrete and standardised manner, ideally by signing a consent form, or
through some kind of computerised substitute (e.g. ticking a checkbox).

Certain populations are considered to be less able to provide autonomous
consent. Such populations include children, prisoners, people with
cognitive impairments, and so on. Applications to work with such
populations generally require a higher level of ethical scrutiny.

### During the experiment

The experiment itself should be designed to minimise discomfort or harm
to the participant. It is expected that experimenters will generally
follow certain principles:

-   Participants should be able to withdraw at any time without penalty
    (financial, reputational, or otherwise).

-   Participants should not be compelled to answer questions that they
    feel uncomfortable answering.

-   Experimenters should avoid using deception. Experiments involving
    deception are possible but require a higher level of ethical
    scrutiny.

### Debriefing

It is good practice to debrief your participant at the end of the
experiment, giving them a concise overview of your research project and
how they have contributed to it. A nice way to do this is by giving
people a quick verbal summary as well as a paper handout that they can
take away and read at their leisure.

### Institutional ethics approval

Before starting data collection you must submit an overview of your
project to an appropriate ethics body for approval. Most universities
have in-house processes for this; you should familiarise yourself with
your own university's systems (for Cambridge's resources, see [this
link](https://www.mus.cam.ac.uk/research/funding-documents/management-of-ethical-issues)).

Most institutions have different tiers of review depending on the nature
of the project, with fast-track reviews for projects that have minimal
ethical implications, and more intensive reviews for projects with more
serious ethical implications. Fast-track reviews can take just a few
days, whereas intensive reviews can take months. However, timelines are
never completely predictable, and it's usually worth making sure you
submit your applications sooner rather than later.

### Reporting in publications

When you write up your experiment in a dissertation or a publication you
should note that your project received institutional ethics approval,
stating both the identity of the approving body and any relevant
approval number. Such a statement is mandatory for many scientific
venues nowadays.
