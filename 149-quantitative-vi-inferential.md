# Inferential statistics



## What are inferential statistics?

Many scientific questions can be formulated in terms of one or more *populations* which we want to understand. These could be populations of humans; for example, we might wish to understand the extent to which socioeconomic status predicts educational outcomes in the general population of schoolchildren. In the context of corpus analyses, these could be populations of music compositions; for example, we might study the extent to which parallel fifths occur in Baroque compositions versus Renaissance compositions.

A given scientific experiment can rarely work with an entire population at once. It is impractical for most scientists to collect educational outcomes for all schoolchildren in the world; likewise, it would be a nigh impossible task to compile digital encodings of all Baroque and Renaissance compositions in existence.

Instead, scientists normally work with *samples*. Samples are smaller datasets that are drawn from a particular population. The hope is that the sample is representative of the larger population, and that we can learn something from the sample that can be generalised to an insight about the population as a whole.

*Inferential statistics* are a special family of statistics that are designed to help us with this generalisation task. They are intended to help us to understand when certain conclusions can be conclusively drawn from a given dataset, and when other conclusions cannot be drawn with any confidence.

## Distributions

When we talk about inferential statistics, we rely heavily on the mathematical concept of *probability distributions*. A probability distribution is a statistical model that tells us how our data samples are generated.

The most fundamental distribution in science is the *normal distribution*, also known as the *Gaussian distribution*. The normal distribution resembles a bell curve:

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-2-1.png" width="100%" />

The shape of this curve tells us what values are likely observations: in particular, the higher the probability density, the more likely the observation. When we generate samples from the probability distribution, they will cluster around these values.

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-3-.gif" width="100%" />

The normal distribution is defined by two parameters: its *mean* and its *standard deviation*. We encountered both of these concepts earlier in Chapter \@ref(descriptive-statistics). The normal distributions above each have a mean of 0 and a standard deviation of 1.

The mean controls the location of the normal distribution. Here are some examples of normal distributions with different means:

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-4-1.png" width="100%" />

The standard deviation (often abbreviated to 'SD") controls the spread of the normal distribution. Here are some examples with different standard deviations:

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-5-1.png" width="100%" />

Much of inferential statistics can then be reduced to variants of the following logical process. We suppose that our population of interest can be modelled by some probability distribution, for example the normal distribution (which happens to resemble many real-world distributions strikingly well). We then try to *infer* the values of this distribution's parameters, for example its mean and standard deviation, based on the data we observe.

## Sample size and uncertainty

The size of our sample is crucial for determining our ability to infer the value of a distribution's parameters. When we have only a few data values, our observations will be dominated by random chance. When we have lots of data values, however, the power of averaging will overcome the noise in the individual samples.

For illustration, let's suppose we are trying to use data to infer the mean of a normal distribution whose true value is 1.5. In the first case, we'll plot the results from 5 experiments, each of which estimate the mean based on just 10 observations:

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-6-1.png" width="100%" />

These estimates of the mean are rather noisy, with a standard deviation of 0.240. We call this value the *standard error*; it tells us how unreliable our mean estimates are.

Now consider an analogous set of experiments, each with 1000 observations:

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-7-1.png" width="100%" />

Now the standard deviation of our means (our standard error) is 0.023, more-or-less a tenth of the original standard error. In other words, increasing our dataset size by a factor of 100 has made our estimates about 10 times more precise. There is a mathematical theorem called the *Central Limit Theorem* that formalises and generalises this observation, showing that in general if you multiply your sample size by $N$, then your standard error will decrease by a factor of $\sqrt{N}$.

The main takeaway message here is that increasing sample size reduces uncertainty. This is why sample size is considered a very important aspect of scientific studies; without sufficient sample sizes, we cannot rely on any of our conclusions.

## Estimating uncertainty

In the example above we estimated our uncertainty in our mean estimations by repeating the same experiment five times and computing the standard deviation of the means. This is not a very practical approach in real-life experiments, because if we had five identical datasets we'd probably want to compute one mean over all datasets (hence achieving a higher effective sample size) rather than computing means over 20% of the dataset at a time. In this case we wouldn't be able to take our same approach of computing the standard deviation of the means, because we'd only have one mean.

Fortunately statisticians have developed various techniques that allow us to have our cake and eat it: to generate standard errors for our estimates while analysing the whole dataset at once. These techniques are mostly straightforward with standard statistical software.

In the simple case where we are computing the mean of a dataset, it turns out that the standard error of this mean can be estimated by taking the standard deviation and dividing it by the square root of the sample size. This is a useful corollary of the Central Limit Theorem mentioned above.

Here is an example of computing the standard error of the mean in R:


```r
data <- c(5, 7, 3, 4, 5, 6, 2, 3, 4)

sd <- sd(data)
sd
#> [1] 1.581139

N <- length(data)
N 
#> [1] 9

se <- sd / sqrt(N)
se
#> [1] 0.5270463
```

In more complex data analysis methods, such as linear regression (see Section \@ref(linear-regression)), most statistical software will return standard errors automatically, based again on various mathematical theorems.

A more general and powerful approach to computing standard errors is to use a technique called *bootstrapping*. Bootstrapping works by simulating thousands of artificial datasets and measuring the distribution of the relevant statistic in these simulations. We will not describe the details here, but it is worth being aware that the technique exists.

## Representing uncertainty

It is good practice to provide uncertainty estimates when reporting inferential statistics (e.g. means) in a scientific report. For example, we might report the mean of a dataset as follows:

> The mean reaction time among the musicians was 700 ms (*SD =* 633ms, *SE* = 76 ms).

Here we have provided both the standard deviation (abbreviated as *SD*), which tells our reader about the spread of our data, and the standard error (abbreviated as *SE*), which tells our reader about the reliability of our mean estimate.

Often scientists will report something called a *confidence interval* instead of the standard error. A confidence interval provides a range of plausible values for a given statistic. Most commonly, scientists will report a 95% confidence interval; the idea behind a 95% confidence interval is that, if we repeated the same experiment infinitely many times, 95% of those repeats should give a mean within that confidence interval. As a rule of thumb, the confidence interval will typically correspond to the mean plus or minus 1.96 standard errors. So, if I have mean of 4.5 and a standard error of 1.5, then my 95% confidence interval will be [1.56, 7.44]. Confidence intervals can be computed automatically by most statistical software packages.

The general philosophy in scientific data analysis is to be conservative about interpreting the values of parameters. In particular, we try only to commit to statements that would only be true no matter what value we chose within the confidence interval. For example, suppose we had the following analysis:

> The musical intervention had a mean effect of 1.5 IQ points (95% confidence interval: [-0.2, 3.2]).

In this case, we would generally *not* conclude that the musical intervention had a positive effect, even though the mean effect was indeed positive; this is because the 95% confidence interval still contains zero, so it is still plausible that the intervention had no effect.

It is conventional to represent uncertainty in plots using *error bars*. Here is an example of a plot containing error bars:

<div class="figure">
<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-9-1.png" alt="Means for three conditions in a fictional dataset. The error bars denote 95% confidence intervals." width="100%" />
<p class="caption">(\#fig:unnamed-chunk-9)Means for three conditions in a fictional dataset. The error bars denote 95% confidence intervals.</p>
</div>

When including error bars in a plot, researchers have a choice of three kinds of uncertainty statistics: confidence intervals, standard errors, or standard deviations. When plotting a confidence interval, the two tails of the error bar correspond to the lower and higher bounds of the confidence interval respectively. When plotting a standard error, the lower tail corresponds to the mean minus one standard error, and the upper tail corresponds to the mean plus one standard error; an analogous approach is taken for plotting the standard deviation, as in the example above.

The choice of uncertainty statistic to include in a plot is primarily up to the researcher. It is essential, however, to specify clearly in the plot description which kind of statistic has been included.

<!-- Moreover, scientists are often interested in a more abstract conception of populations, one which is not limited to the entities that exist at the present moment, but one that also includes entities that could plausibly exist. For example, a music theorist might conceptualise the population of Bach chorale harmonisations as including not only the chorale harmonisations that Bach actually wrote, but also the chorale harmonisations that he might have written had he had the chance.  -->

## Uncertainty and repeated measures

A primary goal of experiment design is to reduce uncertainty. One way of reducing uncertainty is to take advantage of *repeated-measures* analyses. These analyses make intelligent use of repeated-measurement structure in the data to reduce uncertainty in parameters of interest.

Let's consider a simple worked example. Suppose we have the following dataset, of IQ scores before and after a musical intervention: 

<div class="figure">

```{=html}
<div id="htmlwidget-5e2ac1e8a8f8ea979905" style="width:100%;height:auto;" class="datatables html-widget"></div>
<script type="application/json" data-for="htmlwidget-5e2ac1e8a8f8ea979905">{"x":{"filter":"none","vertical":false,"data":[["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],[84,103,105,115,102,94,102,121,137,112,115,105,153,122,78,125,111,80,98,110,107,119,109,113,103,109,129,120,124,119,134,113,110,127,84,96,111,105,120,117,108,105,118,112,120,108,109,118,131,133,118,103,129,133,112,121,104,121,110,106,107,82,107,110,90,114,133,117,125,99,118,92,114,81,111,127,100,103,106,123,118,110,105,132,116,111,130,118,103,115,142,109,104,119,98,128,100,92,113,122],[88,104,105,117,107,92,105,127,140,116,121,109,157,126,78,128,110,84,103,114,110,116,114,118,99,110,137,122,130,120,138,116,114,128,85,103,112,109,121,118,116,110,123,113,119,110,111,121,132,138,124,105,135,134,114,123,107,126,115,107,112,82,108,113,92,115,139,123,131,99,124,93,116,82,114,133,104,111,110,127,127,111,111,130,119,118,128,116,100,117,144,107,108,119,102,126,102,98,116,126]],"container":"<table class=\"display\">\n  <thead>\n    <tr>\n      <th> <\/th>\n      <th>Student<\/th>\n      <th>Pre-test IQ<\/th>\n      <th>Post-test IQ<\/th>\n    <\/tr>\n  <\/thead>\n<\/table>","options":{"searching":false,"rowId":false,"columnDefs":[{"className":"dt-right","targets":[1,2,3]},{"orderable":false,"targets":0}],"order":[],"autoWidth":false,"orderClasses":false}},"evals":[],"jsHooks":[]}</script>
```

<p class="caption">(\#fig:unnamed-chunk-10)A fictional dataset of IQ scores before and after a musical intervention. The red rectangles denote 95% confidence intervals of the means.</p>
</div><div class="figure">
<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-10-2.png" alt="A fictional dataset of IQ scores before and after a musical intervention. The red rectangles denote 95% confidence intervals of the means." width="100%" />
<p class="caption">(\#fig:unnamed-chunk-10)A fictional dataset of IQ scores before and after a musical intervention. The red rectangles denote 95% confidence intervals of the means.</p>
</div>

Here the 95% confidence intervals of the means (plotted with red rectangles) overlap for the two datasets, so we can't infer that there is any meaningful effect of the musical intervention on IQ scores.

However, suppose we construct a new analysis that better takes into account the repeated-measures structure of the data. In particular, suppose we compute a new variable, corresponding to the difference between pre-test and post-test IQ:


```{=html}
<div id="htmlwidget-1e67eefdbd069228c986" style="width:100%;height:auto;" class="datatables html-widget"></div>
<script type="application/json" data-for="htmlwidget-1e67eefdbd069228c986">{"x":{"filter":"none","vertical":false,"data":[["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],[84,103,105,115,102,94,102,121,137,112,115,105,153,122,78,125,111,80,98,110,107,119,109,113,103,109,129,120,124,119,134,113,110,127,84,96,111,105,120,117,108,105,118,112,120,108,109,118,131,133,118,103,129,133,112,121,104,121,110,106,107,82,107,110,90,114,133,117,125,99,118,92,114,81,111,127,100,103,106,123,118,110,105,132,116,111,130,118,103,115,142,109,104,119,98,128,100,92,113,122],[88,104,105,117,107,92,105,127,140,116,121,109,157,126,78,128,110,84,103,114,110,116,114,118,99,110,137,122,130,120,138,116,114,128,85,103,112,109,121,118,116,110,123,113,119,110,111,121,132,138,124,105,135,134,114,123,107,126,115,107,112,82,108,113,92,115,139,123,131,99,124,93,116,82,114,133,104,111,110,127,127,111,111,130,119,118,128,116,100,117,144,107,108,119,102,126,102,98,116,126],[4,2,1,2,5,-2,3,6,3,4,6,5,4,4,-1,3,-0,4,5,4,3,-3,5,5,-4,1,7,2,6,1,4,2,4,2,1,7,1,4,1,1,7,5,5,1,-1,2,3,3,1,5,6,2,6,1,1,3,3,5,4,1,5,0,1,3,2,0,7,6,6,-1,6,1,2,1,3,6,4,8,4,4,8,1,6,-2,3,7,-2,-3,-2,2,2,-2,3,1,4,-3,3,6,3,4]],"container":"<table class=\"display\">\n  <thead>\n    <tr>\n      <th> <\/th>\n      <th>Student<\/th>\n      <th>Pre-test IQ<\/th>\n      <th>Post-test IQ<\/th>\n      <th>IQ change<\/th>\n    <\/tr>\n  <\/thead>\n<\/table>","options":{"searching":false,"rowId":false,"columnDefs":[{"className":"dt-right","targets":[1,2,3,4]},{"orderable":false,"targets":0}],"order":[],"autoWidth":false,"orderClasses":false}},"evals":[],"jsHooks":[]}</script>
```

Then we can plot this new variable with a histogram:

<div class="figure">
<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-12-1.png" alt="The same fictional dataset, but plotting changes in IQ scores. The red rectangle denotes the 95% confidence interval of the mean." width="100%" />
<p class="caption">(\#fig:unnamed-chunk-12)The same fictional dataset, but plotting changes in IQ scores. The red rectangle denotes the 95% confidence interval of the mean.</p>
</div>

Now we see that the 95% confidence interval for the change in IQs is [2.3, 3.4], which does not include zero. So, we can conclude that the musical intervention *did* indeed induce a statistically reliable increase in IQ scores.

Why did we gain so much precision in the latter analysis? In the original analysis, much of the noise in the data came from individual differences in student IQs, which dwarfed the small changes induced by the musical intervention. However, the latter analysis controlled for this variation by subtracting the pre-test IQ from the post-test IQ, producing a dataset that isolated *changes* in IQ. This gives us a much more reliable analysis of the effect of IQ.

Many repeated-measures analyses can be formulated using differencing analyses like the one above. More complex repeated-measures structures sometimes need more complex analysis methods, however. There is a general family of analyses called *mixed-effect* analyses which are particularly well-suited to such problems; we will not consider these methods here, but it's useful to know that they exist.

## Linear regression

In science we often see variables that depend on multiple contributing factors, and we want to quantify the relevant *causal contributions* of each underlying factor. Linear regression is a technique designed to achieve exactly this. 

Let's consider the following example: we wish to understand how house prices depend both on floorspace and on number of rooms. Suppose we collect the following dataset of house prices:


```{=html}
<div id="htmlwidget-58605ee4b53bff9828c9" style="width:100%;height:auto;" class="datatables html-widget"></div>
<script type="application/json" data-for="htmlwidget-58605ee4b53bff9828c9">{"x":{"filter":"none","vertical":false,"data":[["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200"],[129,132,79,109,134,188,182,80,78,198,114,101,131,109,165,174,128,92,67,80,106,167,112,131,138,122,145,177,148,72,95,188,187,189,61,131,60,83,105,129,53,165,64,141,132,98,83,185,163,66,190,69,121,141,175,58,54,77,186,85,62,175,101,198,199,148,122,120,171,167,123,177,183,161,89,76,192,184,126,144,145,96,137,98,163,58,149,73,176,91,163,100,84,172,109,109,77,76,184,148,73,136,65,74,145,148,54,80,150,189,113,113,172,195,150,86,56,197,179,188,129,60,126,119,75,200,178,157,59,96,143,159,141,61,198,194,52,176,196,173,78,159,169,126,72,85,97,195,54,119,91,175,150,108,113,162,143,139,136,58,59,97,143,103,151,171,137,68,104,75,185,75,128,63,61,50,92,193,169,157,127,115,152,79,55,167,87,175,169,101,154,62,108,192,120,154,103,167,163,145],[3,4,2,4,5,5,6,3,2,6,3,3,4,3,6,5,4,3,1,3,2,5,3,4,3,4,4,6,5,2,2,7,6,6,2,5,1,2,2,5,2,5,2,5,4,2,2,6,6,2,6,2,3,4,6,1,1,2,7,3,1,6,3,7,6,5,4,4,6,6,4,6,5,5,3,1,6,5,4,5,5,2,5,3,5,2,4,2,6,2,6,4,2,5,3,2,2,2,6,4,2,3,1,2,4,5,2,2,4,7,3,3,6,6,4,2,1,6,6,6,4,2,4,4,2,7,5,4,1,2,6,6,4,1,7,7,1,5,7,6,2,5,5,3,1,2,2,8,1,4,4,5,4,3,2,5,4,3,4,1,1,2,5,2,5,6,4,2,3,3,5,2,4,2,1,1,2,5,6,5,4,4,4,2,1,5,2,6,6,3,5,1,3,6,3,4,4,5,6,4],["537,500","560,000","209,600","334,500","458,500","581,800","558,500","149,300","345,700","603,500","474,200","285,400","525,100","346,200","569,600","664,600","464,600","405,800","198,100","192,900","415,700","433,900","435,800","344,400","473,800","424,400","543,000","617,000","416,900","251,200","347,700","497,400","584,100","606,200","206,200","432,000","186,300","314,900","396,100","383,000","165,700","519,300","117,400","415,200","381,100","277,600","211,000","504,800","435,600","376,900","771,500","183,300","483,700","656,200","582,300","222,300","86,600","213,400","631,600","194,900","221,800","556,100","389,200","627,800","649,700","373,400","412,400","421,300","567,100","552,800","473,500","573,400","442,500","478,200","286,700","309,600","488,000","677,300","418,400","440,800","433,600","301,200","425,400","334,200","521,900","111,900","497,600","441,600","651,900","433,600","559,900","244,500","359,400","695,800","433,000","284,500","201,700","80,200","665,200","536,900","268,700","521,100","203,800","253,900","444,300","439,500","154,600","168,600","633,600","758,000","452,700","298,600","531,000","637,400","353,000","235,100","30,700","764,200","573,900","639,400","434,100","197,700","402,800","402,700","268,800","673,300","646,100","522,700","213,500","297,200","478,700","462,600","414,500","95,600","591,800","538,500","303,900","540,900","731,600","484,900","295,400","575,200","533,800","282,100","236,700","253,200","416,400","518,900","301,100","380,100","272,600","477,400","538,800","352,800","437,900","508,100","493,100","336,600","433,600","55,500","283,800","378,400","439,900","355,400","395,400","563,600","517,300","122,800","252,200","249,600","597,300","202,000","338,300","207,400","162,600","289,200","291,300","542,300","540,800","642,600","347,900","376,500","399,400","113,800","170,800","587,700","312,900","556,800","615,800","322,400","533,500","142,500","297,800","549,600","460,900","473,100","351,300","509,300","701,000","492,500"]],"container":"<table class=\"display\">\n  <thead>\n    <tr>\n      <th> <\/th>\n      <th>floorspace<\/th>\n      <th>rooms<\/th>\n      <th>price<\/th>\n    <\/tr>\n  <\/thead>\n<\/table>","options":{"searching":false,"rowId":false,"columnDefs":[{"className":"dt-right","targets":[1,2]},{"orderable":false,"targets":0}],"order":[],"autoWidth":false,"orderClasses":false}},"evals":[],"jsHooks":[]}</script>
```

Let's start out by computing pairwise correlations between the two predictor variables and price (the *outcome variable*):

<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-14-1.png" width="100%" /><img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-14-2.png" width="100%" />

In both cases, we see strong positive correlations: houses with more rooms tend to be priced higher, and houses with more floor space tend to be priced higher.

Let's now look at the same data through the lens of linear regression. The primary purpose of linear regression is to estimate *marginal effects*. Marginal effects tell us how the outcome variable would change if we adjusted one predictor while holding all the others constant.

We begin by fitting the regression model:


```r
# Fitting the regression model
mod <- lm(price ~ rooms + floorspace, data = house_dataset)
```

We then plot the marginal effect for floorspace. As before, we see a positive association: increasing floorspace causes the price to increase.


```r
# Plotting marginal effects requires the ggeffects package,
# you can install this with the following command:
#
# install.packages("ggeffects")

(ggeffects::ggpredict(mod, terms = "floorspace") %>% plot()) + 
  scale_x_continuous("Floorspace") + 
  scale_y_continuous("Price") +
  ggtitle(NULL) +
  theme_classic()
```

<div class="figure">
<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-16-1.png" alt="Marginal effect of floorspace on house price in a fictional dataset (95% confidence interval)." width="100%" />
<p class="caption">(\#fig:unnamed-chunk-16)Marginal effect of floorspace on house price in a fictional dataset (95% confidence interval).</p>
</div>

Now let's plot the marginal effect of room number:


```r
(ggeffects::ggpredict(mod, terms = "rooms") %>% plot()) + 
  scale_x_continuous("Number of rooms") + 
  scale_y_continuous("Price") +
  ggtitle(NULL) +
  theme_classic() 
```

<div class="figure">
<img src="149-quantitative-vi-inferential_files/figure-html/unnamed-chunk-17-1.png" alt="Marginal effect of room number on house price in a fictional dataset (95% confidence interval)." width="100%" />
<p class="caption">(\#fig:unnamed-chunk-17)Marginal effect of room number on house price in a fictional dataset (95% confidence interval).</p>
</div>
Interestingly, the previous association between number of rooms and house price is *not* replicated. The overall trend is decreasing (more rooms yields a lower price), but there is a wide confidence interval and the marginal effect might well be zero.

What do we conclude from this? It seems that the real driver of house prices is floorspace, not the number of rooms. Houses with larger floorspace tend to contain more rooms, but having more rooms doesn't make them more valuable *per se*. Linear regression is a valuable tool in situations such as this, where we have multiple variables relating in a complex fashion, and we wish to estimate their causal effects on each other.

### Linear regression and categorical variables

The example above illustrated linear regression with continuous predictor variables. However, it is also perfectly possible to perform linear regression with categorical predictor variables. In this case the marginal effect plot looks like a bar plot instead of a line plot.

### Generating predictions from regression models

We have discussed how regression models can be used for explaining relationships between variables. However, they can also be used for generating predictions for new data points. For example, I can use the regression model from above to predict the price of a house with a floorspace of 125 square metres and 5 rooms:


```r
predict(mod, newdata = tibble(rooms = 5, floorspace = 125)) %>% 
  as.numeric()
#> [1] 391290
```

The `equatiomatic` package in R provides a useful tool for extracting the equation used to generate these predictions:


```r
# install.packages("equatiomatic")

equatiomatic::extract_eq(mod, use_coefs = TRUE)
```

$$
\operatorname{\widehat{price}} = -10396.62 - 13200.7(\operatorname{rooms}) + 3741.52(\operatorname{floorspace})
$$

If you wanted you could use this equation to generate your predictions manually.

### Interactions

An *interaction effect* is when the effect of one predictor depends on the value of another predictor. Interaction effects are easiest to conceptualise when one of the variables is continuous and one is categorical with $N$ levels. In this case, the interaction effect works by estimating $N$ versions of the continuous variable's marginal effect, one for each of the $N$ levels of the categorical variable. However, interactions can in general occur between all kinds of predictor variables.

### Nonlinear regression

Linear regression assumes that all the marginal effects are straight lines. However, it is possible to generalise regression to incorporate nonlinear (wiggly) marginal effects, using techniques such as *polynomial regression* and *generalised additive modelling*. We will not discuss these techniques here but they are conceptually similar to linear regression models aside from their ability to capture nonlinearities.

### Choosing appropriate control variables

Regression is often used to make causal inferences about particular domains. Many researchers are familiar with the idea that incorporating additional variables within a regression model, often termed 'control variables', can be an effective way to extract better causal inferences from observational data. However, it is less appreciated that incorporating inappropriate control variables can in fact *increase* inferential biases. It is worth doing some further reading about this topic if you are planning on such analyses in your own work, see for example @Wysocki2022-lu.

## Null hypothesis significance testing

*Null hypothesis significance testing* is a particular approach to inferential statistics that dominated psychological research for much of the 20th century, and is still very prevalent today. Many modern statisticians however now have deep reservations about this approach, arguing that it does not answer the questions that most scientists actually want to answer, and that it encourages dangerous statistical misconceptions among the researchers that use it. These issues notwithstanding, the great majority of existing literature use these or related techniques, and so it is important to understand them even if one prefers not to use them oneself.

The basic principle in null hypothesis testing is that we use our data to falsify a *null hypothesis* that claims that our dataset is statistically homogeneous. For example, suppose that we are examining differences in means between two experimental conditions, 'A' and 'B'. The null hypothesis is that these two conditions have the same population means. If our data falsify this hypothesis, then we can be confident that some difference exists between the means.

Null hypothesis significance testing relies particularly on the notion of the *p-value*. The p-value is a special statistic with a subtle meaning that many researchers misremember. It can be defined as follows:

> The p-value is the probability that an effect equally extreme or more extreme than the present effect would have been observed were the null hypothesis to be true.

Suppose for example that we observed a difference of 3.2 IQ points between our conditions 'A' and 'B'. The p-value would then tell us the probability that we'd observe an IQ difference of 3.2 or greater in the hypothetical world where 'A' and 'B' had the same population means.

Small p-values constitute stronger evidence against the null hypothesis. For example, $p = .001$ means that we'd only see such a strong effect 1 out of 1000 times if the null hypothesis were true. This is very unlikely, suggesting that we must seriously consider the alternative: that a population difference does exist between the conditions. 

It is conventional to use fixed thresholds for interpreting p-values, in particular the threshold $p = .05$. If the p-value is less than .05, it is conventional to say that the effect is *statistically significant*. In this case, we are 'permitted' to say that we observed an effect in the data:

> Members of the intervention group exhibited statistically significant improvements in IQ scores ($p = .02$).

In contrast, when the p-value is greater than .05, the effect does not reach statistical significance, and we are not allowed to claim that we saw an effect.

> Members of the intervention exhibited no statistically significant improvement in IQ scores over the control group ($p = .25$).

In certain kinds of analyses (for example so-called *post-hoc tests*) this thresholding process is nuanced by the use of so-called *familywise error correction*, intended to control the level of false positives in a given analysis. We need not worry about the details of this here.

Null hypothesis significance testing is associated with a range of different statistical methods in the literature designed to work with different kinds of experiment designs. Examples include: 

- t-tests
- ANOVAs
- Wilcoxon tests
- Friedman tests
- Kruskal-Wallace tests

Though the details of these methods vary, they all try to address a similar question: do the different experimental conditions have different population parameters, or do they have the same population parameters. You will generally see them reported with p-values, which you can interpret according to the definition provided above.

The use of null hypothesis significance testing in psychology is increasingly controversial. Arguably the biggest issue is that it works by trying to disprove a straw-man hypothesis. In psychology, almost any variable is correlated to some degree with almost any other variable, and almost any intervention will have *some kind* of effect if you look closely enough. It is not interesting to know whether the effect is absolutely zero or not, because we know that there will almost always be some effect. Rather, we want to know *how big* the effect is, and in what direction it lies. The p-value tells us nothing about this. This is why we strongly encourage the readers of the present text to focus on reporting confidence intervals in their analyses, and to design their studies around measuring the size of effects rather than testing whether effects exist in the first place.
