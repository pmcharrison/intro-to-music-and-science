---
keep_md: true
---

# Timbre



Informally, we can define timbre as the 'tone colour' or 'tone quality' of a sound. It's what gives a particular musical instrument its individuality. More formally, we can follow the Acoustical Society of America and define timbre as

> "that attribute of auditory sensation which enables a listener to judge that two nonidentical sounds, similarly presented and having the same loudness and pitch, are dissimilar."

A good way of getting a feel for timbre is to listen to the sounds of different musical instruments playing the same pitch, as in the following video. The different sounds are visualised with a spectrogram, which as you'll remember from before describes how the spectral content of a sound develops over time.

![(ref:2d6ecfb9-4023-46d7-a2dc-59f1e24cc70e)  **Spectrograms for different musical instruments.** Credit: [What Music Really İs
](https://www.youtube.com/channel/UCgqviysh9n4dbccXlOyWIfQ)](images/1x1.png)

(ref:2d6ecfb9-4023-46d7-a2dc-59f1e24cc70e) <iframe width="560" height="315" src="https://www.youtube.com/embed/VRAXK4QKJ1Q?start=24" style="display: block; margin-bottom: 25px" title="Spectrograms for different musical instruments." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Timbre perception plays an important role in day-to-day auditory perception. Timbre is by definition independent of loudness, so it doesn't depend much on the distance to the sound source. It's also independent of pitch, meaning that we can recognise the timbre of someone's voice across a wide range of pitches. As a consequence, timbre provides an important cue for identifying different objects from their sounds.

Timbre also depends a lot on an object's physical properties. If we hear someone hit an object with a stick, we can use the sound to guess whether the object is hard or soft, whether it's solid or hollow, and so on.

Timbre also plays a crucial role in speech-based communication. When I'm speaking to you, I can raise or lower the pitch of my voice, and I can speak louder or quieter. But the words that I say to you -- the vowels and the consonants -- are not defined by the pitch or the loudness, but are instead defined by a fast stream of changing timbres.

Timbre ends up being a very useful cue for making sense of complex auditory environments, when there are many different sound sources at the same time, for example at a cocktail party or at an orchestral concert. The brain uses timbre as a cue to organise sound into discrete auditory streams, where each stream might correspond to a particular speaker in a conversation, or to a different musical part in a piece of polyphonic music.

## Psychological methods for studying timbre

### Free-text methods

One way to study timbre is simply to play participants sounds, and ask them to write free text about what they heard. For example, a participant might write:

> This instrument sounds kind of woody. It has a soft breathlike quality at the beginning, but the instrument sustains in a manner that is quite dissimilar to the human voice; it sounds almost like a pipe organ.

We can get very rich and expressive data from this kind of approach. However, this kind of free-form data is complex to analyse quantitatively because of its unstructured format. Two participants can easily write descriptions that on the surface look rather different, even though their subjective experience was relatively similar.

One way of making the data slightly more tractable is to ask people not to write in prose, but instead to write individual words. The same participant might then write something like the following:

> woody; breath; organ

We still might receive many different words this way, many of which might be (near-)synonyms of each other. However, if we collect enough responses, we should see some words repeating more regularly than others. We could visualise this word distribution with a *word cloud*, where more common words appear in larger text. To dig into these responses more rigorously, one could adopt a *qualitative* approach, where the researcher thinks carefully about the different themes present in the text and summarises them accordingly (see Section \@ref(quantitativequalitative). More recently, *quantitative* approaches have become more feasible through advances in computational techniques for processing language (a field known as *natural language processing*), providing principled methods for extracting the semantic content of written text in a way that acknowledges (partial) synonyms.

### Semantic rating scales

An alternative way to study timbre perception is with *semantic rating scales*. Here we get the participant to evaluate a single perceptual dimension of the sound at a time, for example its 'brightness'. The participant rates this dimension on a numeric scale, for example from 'very dark' to 'very bright'. This means that we can then average results over multiple participants to get a more reliable outcome.

This approach has a clear advantage over the free-text approaches, in that the data are very straightforward to analyse quantitatively. This comes at the expense of having to restrict the available response options *a priori* to one or more terms preselected by the researcher. This is feasible for domains that have already been studied in some detail, but it is not very practical for domains about which we currently know little.

### Similarity judgments

A disadvantage of both free-text and semantic rating approaches is that all the results are filtered through language. This is a problem if we believe there might be important aspects of timbre perception that participants struggle to put into words.

A clever way to sidestep this problem is to use similarity judgements instead. In the classic similarity judgement paradigm, we play participants pairs of sounds, and we ask them to rate the similarity of each pair. The appealing feature of this approach is that similarity judgements do not need to be mediated by any verbal vocabulary; participants are free to compare the sounds based on whatever perceptual features they deem relevant, even if they don't have good words for them.

One we've presented lots of stimulus pairs to participants, we can construct a *similarity matrix*, which looks something like this:

![Example similarity matrix as derived from a similarity judgement experiment.](images/similarity-matrix.png){width="500"}

Each number in a similarity matrix tells us the average perceptual similarity of a pair of stimuli. For example, the cell in the fourth row and the first column has a value of 0.73, which tells us that the normalised similarity between the first and fourth stimulus is 0.73. Similarly, the 0.1 in the sixth row and the fifth column tells us that the normalised similarity between the sixth and the fifth stimulus is 0.1.

These similarity matrices quickly become very big, making them no easier to interpret directly than the free-text paradigm we considered earlier. We need some kind of statistical technique to distil this data down and create some meaningful quantitative insights. We call this process *dimensionality reduction*.

Here we're going to focus on a particularly method called *multidimensional scaling* ('MDS'). This is a popular method for dimensionality reduction in timbre perception studies. MDS takes the similarity matrices as its input, and uses them to compute a low-dimensional space, constructed so as to preserve the similarities between stimuli as well as possible. In this example the space has just two dimensions, but we can just as well fit spaces with higher numbers of dimensions, they're just harder to visualise. Each stimulus is automatically given a location in the MDS space: the idea is that stimuli with high similarity are located close to each other, and stimuli with low similarity are located far apart.\

![Multidimensional scaling takes a similarity matrix and expresses it in a low-dimensional space where pairwise distances reflect pairwise similarities.](images/similarity-matrix-to-mds.png){width="100%"}

For example, look at the first column of the similarity matrix. This tells us the raw pairwise similarities for stimulus 1. We see high similarity with stimuli 2, 4, and 6; correspondingly we see that stimuli 2, 4, and 6 are neighbours in the MDS space. In contrast, the similarity with stimulus 5 is low, and so 1 and 5 are distant in the MDS space.

So, imagine that we now have an MDS solution, with all our stimuli being placed in the multidimensional space. We now hypothesise that the dimensions of this space reflect fundamental perceptual features of the stimuli that are highly salient to the participant. MDS doesn't tell us anything about these dimensions except for the locations of each stimulus on that dimension. However, there are various ways for us to find out useful information about these dimensions. For example, we can correlate each dimension with acoustic analyses of the stimuli. We can also have participants generate word associations for each dimension.

MDS has been applied many times to timbre over the last few decades, producing lots of evidence for the fundamental dimensions of timbre perception [@McAdams2009]. Here we're not going to talk so much about individual timbre MDS studies; instead we'll talk more about the knowledge that these and related studies have generated.

When we interpret the results from these timbre studies, we end up returning to a recurrent theme: the distinction between *temporal* and *spectral* properties of sound. Temporal properties describe how the sound changes over time, whereas spectral properties describe how the sound's energy is distributed through the harmonic spectrum. We'll discuss both aspects in turn.

## Decomposing timbre

### Temporal aspects

As you'll remember from earlier in the course, we can represent sounds as waveforms, describing periodic fluctuations in sound pressure over time. For a pitched musical sound, these fluctuations happen very fast: for example, a sine wave corresponding to middle C will repeat itself approximately 262 times every second. We can call this 'low-level temporal structure'.

![**Sine wave corresponding to middle C (~ 262 Hz).**](images/middle-c-waveform.png){width='500px'}

In contrast, when we talk about temporal aspects of *timbre* perception, we're instead interested at temporal dynamics at longer time scales. We're interested not the specific ups and downs of the waveform, but we're instead interested in the 'envelope' within which the waveform oscillates. We can see this envelope if we 'zoom out' the visualisation, as follows (note that the wiggles in waveform are now squashed so close together that they just produce a solid block):

![**Example temporal envelope.**](images/temporal-envelope-generic.png){width='500px'}

If we look at different instrumental sounds at this level of representation, we see quite different envelopes. For example, the harpsichord grows fast, then immediately decays:

![**Temporal envelope computed from a harpsichord.** (ref:c03065fb-8e27-4b9d-a691-5b0cc8c948a0) ](images/temporal-envelope-harpsichord.png){width='500px'}

(ref:c03065fb-8e27-4b9d-a691-5b0cc8c948a0)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/temporal-envelope-harpsichord.wav' type='audio/mpeg'></audio>

Other sounds like the flute or the violin grow slower, and then can sustain for a long time:

![**Temporal envelope computed from a flute.** (ref:d14172d1-fb5e-4021-ad5a-4c5569a35173) ](images/temporal-envelope-flute.png){width='500px'}

(ref:d14172d1-fb5e-4021-ad5a-4c5569a35173)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/temporal-envelope-flute.wav' type='audio/mpeg'></audio>

![**Temporal envelope computed from a violin.** (ref:dd588c91-e8bd-4bcc-a125-c4ebe4a5f0bf) ](images/temporal-envelope-violin.png){width='500px'}

(ref:dd588c91-e8bd-4bcc-a125-c4ebe4a5f0bf)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/temporal-envelope-violin.wav' type='audio/mpeg'></audio>

The *ADSR model* is an attempt to capture the key components in which these different envelopes vary. It's a simplification of what we might see in the real world, but the important thing is that it's a simplification that's meant to retain the aspects of the envelope that are particularly salient in timbre perception.

![**Generic ADSR envelope.**](images/adsr-example-envelope.png){width='500px'}

The standard ADSR model splits the envelope into four portions:

1.  The *attack* portion is where the envelope rises from zero amplitude to the maximum amplitude. The attack parameter set the *duration* of this portion.
2.  The *decay* portion is where the envelope decays from its maximum amplitude to a lower amplitude, over a time period corresponding to the decay parameter.
3.  The *sustain* portion has the amplitude remain constant, at a level determined by the *sustain* parameter.
4.  The *release* portion has the amplitude decay to zero over a time period specified by the *release* parameter.

![**Definition of the ADSR model.**](images/adsr-model-definition.png){width='500px'}

Let's explore how each of these components contribute to making a distinctive timbre. We'll begin with a vanilla harmonic complex tone, one with a constant amplitude and frequency:

![**A vanilla harmonic complex tone.** (ref:5f1a5c9f-ee42-4141-8cf0-f8718e3945de) ](images/adsr-incremental-1.png){width='500px'}

(ref:5f1a5c9f-ee42-4141-8cf0-f8718e3945de)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/adsr-incremental-1.wav' type='audio/mpeg'></audio>

Let's now try adding an *attack* portion to the envelope. First of all, let's try a rather longer attack portion, lasting for half a second. The result already feels more naturalistic than the original tone.

![**Setting the attack parameter to 0.5 s.** (ref:87759254-2f00-4db6-9871-60c4672c6461) ](images/adsr-incremental-2.png){width='500px'}

(ref:87759254-2f00-4db6-9871-60c4672c6461)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/adsr-incremental-2.wav' type='audio/mpeg'></audio>

Now let's make the attack portion very short, and let's add a short decay portion, whereby the amplitude decays to 15% of the original. This combination of short attack and decay portions makes the tone sound somewhat like a plucked string instrument. However, the resemblance to a plucked string is marred by the constant amplitude in the latter part of the tone.

![**Setting the attack parameter to 0.01 s, the decay parameter to 0.01 s, and the sustain parameter to 0.15.** (ref:8fc0ec18-a086-4ddd-b374-86428be1bab9) ](images/adsr-incremental-3.png){width='500px'}

(ref:8fc0ec18-a086-4ddd-b374-86428be1bab9)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/adsr-incremental-3.wav' type='audio/mpeg'></audio>

In the final version, we therefore add a one-second release portion. This improves the sound a lot, and the resulting tone now sounds pretty close to an electric guitar.

![**Setting the release parameter to 1.0 s.** (ref:8687c250-aca1-44d3-ba46-8d36e0c6c778) ](images/adsr-incremental-4.png){width='500px'}

(ref:8687c250-aca1-44d3-ba46-8d36e0c6c778)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/adsr-incremental-4.wav' type='audio/mpeg'></audio>

The below app allows you to manipulate the parameters of the ADSR model interactively, and explore the resulting effect on the sound.

<!--
Original code (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc, https://github.com/voidqk/simple-js-synth
Heavily modified by Peter Harrison (2021)
MIT License
-->
<style>
  html, body { font-family: sans-serif; }
  table, tr {
    border-collapse: collapse;
    padding: 0;
  }
  th, td {
    padding: 5px;
    border: 1px solid #777;
    text-align: center;
  }
  pre {
    text-align: left;
    margin: 0 10px;
  }
  #osc1vol , #osc2vol , #osc3vol             { width: 120px; }
  #osc1tune, #osc2tune, #osc3tune            { width: 280px; }
  #attack  , #decay   , #sustain , #susdecay { width: 500px; }
  #cutoff                                    { width: 400px; }
</style>

<script>
  (function(){
  
  function SimpleJSSynth(dest, opts){
  	// `dest` is the AudioNode destination
  	// `opts` is an object; see notes further down for meaning and range of values.
  	// {
  	//   osc1type : 'sine'|'square'|'sawtooth'|'triangle', // type of wave
  	//   osc1vol  : 0 to 1,                                // oscillator volume (linear)
  	//   osc1tune : 0,                                     // relative tuning (semitones)
  	//   osc2type, osc2vol, osc2tune,                      // settings for osc2
  	//   osc3type, osc3vol, osc3tune,                      // settings for osc3
  	//   attack   : 0 to inf,                              // attack time (seconds)
  	//   decay    : 0 to inf,                              // decay time (seconds)
  	//   sustain  : 0 to 1,                                // sustain (fraction of max vol)
  	//   susdecay : 0 to inf,                              // decay during sustain (seconds)
  	//   cutoff   : -inf to inf                            // filter cutoff (relative semitones)
  	// }
  
  	var ctx = dest.context; // get the WebAudio context
   
  	//
  	//   Osc1 ---> Osc1 Gain ---+
  	//                          |
  	//   Osc2 ---> Osc2 Gain ---+---> Envelope Gain ---> Filter --> Destination
  	//                          |
  	//   Osc3 ---> Osc3 Gain ---+
  	//
  
  	var filter = ctx.createBiquadFilter();
  	filter.type = 'lowpass';
  	filter.frequency.setValueAtTime(22050, ctx.currentTime);
  	filter.Q.setValueAtTime(0.5, ctx.currentTime);
  
  	var my = filter; // the returned object is the filter
  
  	var gain = ctx.createGain();
  	gain.gain.setValueAtTime(0, ctx.currentTime);
  	gain.connect(filter);
  
  	function oscgain(v, def){
  		var g = ctx.createGain();
  		v = typeof v === 'number' ? v : def;
  		g.gain.setValueAtTime(0, ctx.currentTime);
  		g.connect(gain);
  		return { node: g, base: v };
  	}
  	var osc1gain = oscgain(opts.osc1vol, 0.8);
  	var osc2gain = oscgain(opts.osc2vol, 0.6);
  	var osc3gain = oscgain(opts.osc3vol, 0.4);
  
  	function osctype(type, g){
  		var osc = ctx.createOscillator();
  		osc.type = typeof type === 'string' ? type : 'sine';
  		osc.connect(g);
  		return osc;
  	}
  	var osc1 = osctype(opts.osc1type, osc1gain.node);
  	var osc2 = osctype(opts.osc2type, osc2gain.node);
  	var osc3 = osctype(opts.osc3type, osc3gain.node);
  
  	function calctune(t){
  		if (typeof t !== 'number')
  			return 1;
  		return Math.pow(2, t / 12);
  	}
  	var tune1 = calctune(opts.osc1tune);
  	var tune2 = calctune(opts.osc2tune);
  	var tune3 = calctune(opts.osc3tune);
  	var cutoff = calctune(opts.cutoff);
  
  	var attack   = typeof opts.attack   == 'number' ? opts.attack   : 0.1;
  	var decay    = typeof opts.decay    == 'number' ? opts.decay    : 0.2;
  	var sustain  = typeof opts.sustain  == 'number' ? opts.sustain  : 0.5;
  	var susdecay = typeof opts.susdecay == 'number' ? opts.susdecay : 10;
  	var release = typeof opts.release == 'number' ? opts.release : 0.5;
  
  	// clamp the values a bit
  	var eps = 0.001;
  	if (attack < eps)
  		attack = eps;
  	if (decay < eps)
  		decay = eps;
  	if (sustain < eps)
  		sustain = eps;
  	if (susdecay < eps)
  		susdecay = eps;
		if (release < eps)
		  release = eps;
  
  	var basefreq = 0;
  	var silent = 0;
  	var ndown = false;
  
  	osc1.start();
  	osc2.start();
  	osc3.start();
  
  	my.connect(dest);
  
  	my.noteOn = function(freq, vol){
  		ndown = true;
  		basefreq = freq;
  		var now = ctx.currentTime;
  		osc1.frequency.setValueAtTime(freq * tune1, now);
  		osc2.frequency.setValueAtTime(freq * tune2, now);
  		osc3.frequency.setValueAtTime(freq * tune3, now);
  		filter.frequency.setValueAtTime(Math.min(freq * cutoff, 22050), now);
  		osc1gain.node.gain.setValueAtTime(vol * osc1gain.base, now);
  		osc2gain.node.gain.setValueAtTime(vol * osc2gain.base, now);
  		osc3gain.node.gain.setValueAtTime(vol * osc3gain.base, now);
  		var v = gain.gain.value;
  		gain.gain.cancelScheduledValues(now);
  		gain.gain.setValueAtTime(v, now);
  		var hitpeak = now + attack;
  		var hitsus = hitpeak + decay;
  		silent = hitsus + susdecay;
  		gain.gain.linearRampToValueAtTime(1, hitpeak);
  		gain.gain.linearRampToValueAtTime(sustain, hitsus);
  		gain.gain.linearRampToValueAtTime(0.000001, silent);
  	};
  
  	my.bend = function(semitones){
  		var b = basefreq * Math.pow(2, semitones / 12);
  		var now = ctx.currentTime;
  		osc1.frequency.setTargetAtTime(b * tune1, now, 0.1);
  		osc2.frequency.setTargetAtTime(b * tune2, now, 0.1);
  		osc3.frequency.setTargetAtTime(b * tune3, now, 0.1);
  	};
  
  	my.noteOff = function(){
  		ndown = false;
  		var now = ctx.currentTime;
  		var v = gain.gain.value;
  		gain.gain.cancelScheduledValues(now);
  		gain.gain.setValueAtTime(v, now);
  		silent = now + release;
  		gain.gain.linearRampToValueAtTime(0.000001, silent);
  	};
  
  	my.isReady = function(){
  		return ctx.currentTime >= silent && !ndown;
  	};
  
  	my.stop = function(){
  		ndown = false;
  		var now = ctx.currentTime;
  		osc1gain.node.gain.setValueAtTime(0.000001, now);
  		osc2gain.node.gain.setValueAtTime(0.000001, now);
  		osc3gain.node.gain.setValueAtTime(0.000001, now);
  		silent = 0;
  	};
  
  	my.destroy = function(){
  		ndown = false;
  		silent = 0;
  		osc1.stop();
  		osc2.stop();
  		osc3.stop();
  		my.disconnect();
  	};
  
  	return my;
  }
  
  if (typeof window !== 'undefined')
  	window.SimpleJSSynth = SimpleJSSynth;
  else
  	module.exports = SimpleJSSynth;
  })();
</script>

<style>
  .paramDisplay {
    margin-left: 10px;
  }
</style>

<div id="synth-controls">
  <table style="border: 2px solid black">
  	<tbody>
  		<tr style="display: none">
  			<th style="width: 50px" onclick="MM();">Oscillator</th>
  			<th>Type</th>
  			<th>Volume</th>
  			<th style="width: 100px">Tune</th>
  			<td rowspan="11"><pre id="raw"></pre></td>
  		</tr>
  		<tr style="display: none">
  			<td>1</td>
  			<td><select id="osc1type">
  				<option value="sine">sine</option>
  				<option value="square">square</option>
  				<option value="triangle">triangle</option>
  				<option value="sawtooth">sawtooth</option>
  			</select></td>
  			<td>0 <input type="range" min="0" max="50" value="20" id="osc1vol" /> 0.5</td>
  			<td>-12 <input type="range" min="-120" max="120" value="0" id="osc1tune" /> +12</td>
  		</tr>
  		<tr style="display: none">
  			<td>2</td>
  			<td><select id="osc2type">
  				<option value="sine">sine</option>
  				<option value="square" selected="selected">square</option>
  				<option value="triangle">triangle</option>
  				<option value="sawtooth">sawtooth</option>
  			</select></td>
  			<td>0 <input type="range" min="0" max="50" value="10" id="osc2vol" /> 0.5</td>
  			<td>-12 <input width="50px" type="range" min="-120" max="120" value="120" id="osc2tune" /> +12</td>
  		</tr>
  		<tr style="display: none">
  			<td>3</td>
  			<td><select id="osc3type">
  				<option value="sine">sine</option>
  				<option value="square">square</option>
  				<option value="triangle">triangle</option>
  				<option value="sawtooth">sawtooth</option>
  			</select></td>
  			<td>0 <input type="range" min="0" max="50" value="5" id="osc3vol" /> 0.5</td>
  			<td>-12 <input type="range" min="-120" max="120" value="-120" id="osc3tune" /> +12</td>
  		</tr>
  		<tr style="display: none">
  			<th colspan="4" style="border-top: 2px solid #777;">Envelope</th>
  		</tr>
  		<tr>
  			<th style="color: #407E22">Attack</th>
  			<td colspan="3"> 
  			  <input 
  			    style="width: 200px" type="range" min="-5" max="1" step="0.001"
  			    value="-4.5" id="attackSlider" 
  		    /> 
  			  <span id="attack" class="paramDisplay"></span>
  			</td>
  		</tr>
  		<tr>
  			<th style="color: #F76602">Decay</th>
  			<td colspan="3">
  			  <input
  			    style="width: 200px" type="range" min="-5" max="1" step="0.001" 
  			    value="-4.5" id="decaySlider" 
  		    />
  			  <span id="decay" class="paramDisplay"></span>
  		  </td>
  		</tr>
  		<tr>
  			<th style="color: #2008FF">Sustain</th>
  			<td colspan="3"> 
  			  <input 
  			    style="width: 200px" type="range" min="0" max="1" step="0.001" 
  			    value="0.15" id="sustainSlider" 
  		    />
  			  <span id="sustain" class="paramDisplay"></span>
  		  </td>
  		</tr>
  		<tr style="display: none">
  			<th>Sus. Decay</th>
  			<td colspan="3"> 
  			  <input style="width: 200px" type="range" min="0" max="100" value="10" id="susdecay" />
        </td>
  		</tr>
  		<tr>
  			<th style="color: #800380">Release</th>
  			<td colspan="3">
  		    <input 
  		      style="width: 200px" type="range" min="0" max="8" value="1" 
  		      step="0.001" id="releaseSlider" 
  	      /> 
  		    <span id="release" class="paramDisplay">1.000</span>
  	    </td>
  		</tr>
  		<tr>
  			<td colspan="4" style="padding: 0; line-height: 0;">
  			  <canvas id="env" width="1440" height="200" style="width: 500px; height: 100px; margin: 10px;"></canvas>
  	    </td>
  		</tr>
  		<tr style="border-top: 2px solid #777; display: none">
  			<th id="cutoff_txt">Cutoff</th>
  			<td><select id="filter">
  				<option value="1">Enable</option>
  				<option value="0">Disable</option>
  			</select></td>
  			<td colspan="2">-12 <input type="range" min="-120" max="480" value="360" id="cutoff" /> +48</td>
  		</tr>
  	</tbody>
  </table>
</div>

<br />

<script>
  // create our WebAudio context
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var actx = new AudioContext();
  
  // store the global bend amount for future notes to play at
  var globalbend = 0;
  
  // create a pool of monophonic synths to turn it into polyphonic
  var pool = [];
  
  // store our options to detect changes
  var lastopts = null;
  
  function getOpts() {
  	// create our options object based on the form
  	function osctype(id){
  		var sel = document.getElementById('osc' + id + 'type');
  		return sel.options[sel.selectedIndex].value;
  	}
  	function getnum(id, base){
  		return parseFloat(document.getElementById(id).value) / base;
  	}
  	var docutoff = document.getElementById('filter').selectedIndex == 0;
    return {
  		osc1type: osctype(1),
  		osc1vol : getnum('osc1vol', 100),
  		osc1tune: getnum('osc1tune', 10),
  		osc2type: osctype(2),
  		osc2vol : getnum('osc2vol', 100),
  		osc2tune: getnum('osc2tune', 10),
  		osc3type: osctype(3),
  		osc3vol : getnum('osc3vol', 100),
  		osc3tune: getnum('osc3tune', 10),
  		attack  : getnum('attack', 1),
  		decay   : getnum('decay', 1),
  		sustain : getnum('sustain', 1),
  		susdecay: 100000,
  		release : getnum('release', 1),
  		// susdecay: getnum('susdecay', 10),
  		docutoff: docutoff,
  		cutoff  : docutoff ? getnum('cutoff', 10) : 1000
  	};
  }
  
	// draw the envelope
	function drawEnvelope(){
	  var opts = getOpts();
		var cnv = document.getElementById('env');
		var ctx = cnv.getContext('2d');
		var pps = 170; // pixels per second
		var origin_x = 50;
		var attack_x = origin_x + opts.attack * pps;
		// var sustain_x = attack_x + (1 - opts.sustain) * opts.decay * pps;
		var sustain_x = attack_x + opts.decay * pps;
		var sustain_y = (1 - opts.sustain) * cnv.height;
		var endsus_x = sustain_x + 2 * pps;
		var endsus_y = (1 - opts.sustain * (1 - 2 / Math.max(opts.susdecay, 0.001))) * cnv.height;
		var release_x = endsus_x + opts.release * pps;
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, cnv.width, cnv.height);
		// ctx.fillStyle = '#eee';
		ctx.fillRect(endsus_x, 0, cnv.width, cnv.height);
		
		ctx.beginPath();
		
		ctx.strokeStyle = '#407E22';
		ctx.setLineDash([]);
		ctx.lineWidth = 4;
		
		ctx.moveTo(origin_x, cnv.height);
		ctx.lineTo(attack_x, 0);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = '#F76602';
		ctx.fillStyle = '#F76602';
		ctx.moveTo(attack_x, 0);
		ctx.lineTo(sustain_x, sustain_y);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = '#2008FF';
		ctx.setLineDash([10, 10]);
		ctx.moveTo(sustain_x, sustain_y);
		ctx.lineTo(endsus_x, endsus_y);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.strokeStyle = '#800380';
		ctx.moveTo(endsus_x, endsus_y);
		ctx.lineTo(release_x, cnv.height);
		ctx.stroke();
		
		/*
		ctx.beginPath();
		ctx.moveTo(attack_x, 0);
		ctx.lineTo(attack_x, cnv.height);
		
		ctx.strokeStyle = 'red';
		ctx.moveTo(sustain_x, 0);
		ctx.lineTo(sustain_x, cnv.height);
		ctx.moveTo(endsus_x, 0);
		ctx.lineTo(endsus_x, cnv.height);
		ctx.setLineDash([5, 5]);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.beginPath();
		// ctx.arc(sustain_x, sustain_y, 10, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
		// ctx.arc(endsus_x, endsus_y, 10, 0, Math.PI * 2);
		ctx.stroke();
		*/
	}
	
  let attackSlider = document.getElementById("attackSlider");
  let decaySlider = document.getElementById("decaySlider");
  let sustainSlider = document.getElementById("sustainSlider");
  let releaseSlider = document.getElementById("releaseSlider");
  
  let attackDisplay = document.getElementById("attack");
  let decayDisplay = document.getElementById("decay");
  let sustainDisplay = document.getElementById("sustain");
  let releaseDisplay = document.getElementById("release");
  
  let addListener = function(slider, display, logarithmic) {
    let getVal = function() {
      let raw = parseFloat(slider.value); 
      if (logarithmic) {
        return Math.exp(raw); 
      } else {
        return raw;
      }
    };
    let listener = function() {
	    let val = getVal();
	    display.value = val; 
	    display.innerHTML = val.toFixed(3); 
	    drawEnvelope();
    };
    listener();
    slider.addEventListener("input", listener)
  }
  
  addListener(attackSlider, attackDisplay, true);
  addListener(decaySlider, decayDisplay, true);
  addListener(sustainSlider, sustainDisplay, false);
  addListener(releaseSlider, releaseDisplay, false);
  
  function reload(){
  	var opts = getOpts();
  
  	// if our options haven't changed from before, then return immediately
  	if (lastopts !== null &&
  		lastopts.osc1type === opts.osc1type &&
  		lastopts.osc1vol  === opts.osc1vol  &&
  		lastopts.osc1tune === opts.osc1tune &&
  		lastopts.osc2type === opts.osc2type &&
  		lastopts.osc2vol  === opts.osc2vol  &&
  		lastopts.osc2tune === opts.osc2tune &&
  		lastopts.osc3type === opts.osc3type &&
  		lastopts.osc3vol  === opts.osc3vol  &&
  		lastopts.osc3tune === opts.osc3tune &&
  		lastopts.attack   === opts.attack   &&
  		lastopts.decay    === opts.decay    &&
  		lastopts.sustain  === opts.sustain  &&
  		lastopts.susdecay === opts.susdecay &&
  		lastopts.release === opts.release &&
  		lastopts.cutoff   === opts.cutoff)
  		return;
  
  	// output JSON object to UI
  	document.getElementById('raw').innerHTML = JSON.stringify(opts, null, 3);
  
  	// change UI to reflect whether cutoff is enabled
  	document.getElementById('cutoff_txt').style.color = opts.docutoff ? '#000' : '#999';
  	document.getElementById('cutoff').disabled = !opts.docutoff;
  
  	// destroy all synths currently in the pool
  	while (pool.length > 0)
  		pool.pop().destroy(); // pop a synth and destroy it
  
  	// recreate the pool based on the new options
  	for (var i = 0; i < 20; i++)
  		pool.push(SimpleJSSynth(actx.destination, opts));
  
  	// save the options for later comparison
  	lastopts = opts;
  }
  
  // attach update events to reload
  (['osc1type', 'osc1vol', 'osc1tune', 'osc2type', 'osc2vol', 'osc2tune', 'osc3type', 'osc3vol',
  	'osc3tune', 'attack', 'decay', 'sustain', 'susdecay', 'filter', 'cutoff']).forEach(function(id){
  	document.getElementById(id).addEventListener('change', reload);
  });
  
  // check our options every 200ms
  setInterval(reload, 200);
  
  // fired when a note is hit, either via the UI, or via MIDI
  function noteHit(freq, vol){
  	for (var i = 0; i < pool.length; i++){
  		// search the pƒool of synths that are ready for a new note
  		if (pool[i].isReady()){
  			// trigger and return the synth
  			pool[i].noteOn(freq, vol);
  			return pool[i];
  		}
  	}
  	// no synths available, so don't do anything, and return a junk object
  	return {
  		noteOff: function(){},
  		bend: function(){}
  	};
  }
  
  // track which notes are currently playing
  var mididown = [];
  for (var i = 0; i < 128; i++)
  	mididown.push(false);
  
  // called when a note is hit or released via UI or MIDI
  function midiHit(note, vel, down){
  	// silence the note
  	if (mididown[note]){
  		mididown[note].noteOff();
  		mididown[note] = false;
  	}
  	// if we're pressing down, play the note
  	if (down){
  		var freq = 440 * Math.pow(2, (note - 69) / 12); // convert note to frequency
  		var vol  = vel / 127;                           // convert velocity to volume
  		mididown[note] = noteHit(freq, vol);
  		// if we have a global bend, apply it immediately
  		if (globalbend != 0)
  			mididown[note].bend(globalbend);
  	}
  }
  
  // called when MIDI sends a bend message
  function midiBend(amt){
  	// set the global bend of +-2 semitones
  	globalbend = amt * 2;
  
  	// scan all playing notes and bend them accordingly
  	for (var i = 0; i < 128; i++){
  		if (mididown[i])
  			mididown[i].bend(globalbend);
  	}
  }
  
  // called when MIDI has initialized
  function midiInit(midi){
  	function midiHook(){
  		var inputs = midi.inputs.values();
  		for (var input = inputs.next(); input && !input.done; input = inputs.next())
  			input.value.onmidimessage = midiEvent;
  	}
  	midiHook();
  	midi.onstatechange = midiHook;
  }
  
  // called when MIDI fails to initialize... don't do anything
  function midiReject(){
  	console.warn('MIDI failed to initialize... oh well');
  }
  
  // called when a MIDI message is received
  function midiEvent(ev){
  	if (ev.data.length < 2)
  		return;
  	// look for note on, note off, and pitch bend messages
  	if ((ev.data[0] & 0xF0) == 0x90)
  		midiHit(ev.data[1], ev.data[2], true);
  	else if ((ev.data[0] & 0xF0) == 0x80)
  		midiHit(ev.data[1], 0, false);
  	else if ((ev.data[0] & 0xF0) == 0xE0){
  		if (ev.data[1] == 0 && ev.data[2] == 0x40)
  			midiBend(0);
  		else
  			midiBend((ev.data[1] | (ev.data[2] << 7)) * 2 / 0x3FFF - 1);
  	}
  }
  
  // request MIDI access
  if (navigator.requestMIDIAccess)
  	navigator.requestMIDIAccess().then(midiInit, midiReject);
  
  var div = document.createElement('div');
  div.className = "btn btn-primary";
	div.style.display = 'inline-block';
	div.style.margin = '1px';
	div.style.padding = '15px';
	div.style.border = '1px solid #000';
	div.style.cursor = 'default';
	//div.style.backgroundColor = '#eef';
	div.appendChild(document.createTextNode("Play tone"));
	document.getElementById("synth-controls").appendChild(div);

	// hook mouse events to the DIV
	function cancel(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	function mousedown(e){
		// if the mouse is pressed, simulate a MIDI note on
		actx.resume();
		midiHit(60, 100, true);
		return cancel(e);
	}
	function mouseup(e){
		// if the mouse is released, simulate a MIDI note off
		midiHit(60, 0, false);
		return cancel(e);
	}
	div.addEventListener('mousemove', cancel);
	div.addEventListener('mousedown', mousedown);
	div.addEventListener('mouseup', mouseup);
	div.addEventListener('mouseout', mouseup);
	div.addEventListener('touchmove', cancel);
	div.addEventListener('touchstart', mousedown);
	div.addEventListener('touchend', mouseup);
	div.addEventListener('touchleave', mouseup);
	div.addEventListener('selectstart', cancel);
	div.unselectable = 'on';
	div.style.mozUserSelect = 'none';
	div.style.webkitUserSelect = 'none';
	div.style.userSelect = 'none';
  
  function MM(){
  	var i = 0, p = 0, s = 'MMMOM]QMM]\\MLMMMOM]QMM]\\ORlT]ORlT]\\]QOLOLMLMOLpA';
  	function n(){
  		var c = s.charCodeAt(i++) - 65, m = 70 + c % 11, z = Math.floor(c / 11);
  		if (p > 70) midiHit(p,   0, false);
  		if (m > 70) midiHit(m, 100, true );
  		if (z >  0) setTimeout(n, z * 187);
  		p = m;
  	}
  	n();
  }
</script>

It's important to recognise that the ADSR model is a big simplification compared to real instrument envelopes. This simplicity has useful benefits, though: it makes the model easy to interpret and easy to control. If we do want to capture more complex dynamics, there are various natural extensions we can make, for example adding non-linear segments or adding periodic amplitude fluctuations.

### Spectral aspects

As you'll remember from before, when a pitched musical instrument plays a given note, the resulting sound contains many different frequency components, represented visually as vertical lines. Generally speaking, these frequency components will all be integer multiples of a common fundamental frequency.

![**Idealised harmonic spectrum.** (ref:21fc3946-16a7-4dda-8506-3a1b0e4ff19b) ](images/harmonic-spectrum.png){width='500px'}

(ref:21fc3946-16a7-4dda-8506-3a1b0e4ff19b)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/harmonic-spectrum.wav' type='audio/mpeg'></audio>

Spectral aspects of timbre concern the amplitudes of these different frequency components. We're now going to look at a few different ways of describing these spectral aspects.

#### Spectral centroid

The spectral centroid describes how much of the spectral energy is concentrated in higher rather than lower harmonics. A high centroid tends to make the sound appear bright and piercing.

![**Tone with a high spectral centroid.** (ref:23f12d77-4b16-4c2f-a96d-f1445e5a627d) ](images/spectral-centroid-high.svg){width='400px'}

(ref:23f12d77-4b16-4c2f-a96d-f1445e5a627d)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/spectral-centroid-high.wav' type='audio/mpeg'></audio>

Conversely, a low centroid makes the sound appear dull.

![**Tone with a low spectral centroid.** (ref:a02772ae-8ed5-4feb-aa68-dbbcbd4403d3) ](images/spectral-centroid-low.svg){width='400px'}

(ref:a02772ae-8ed5-4feb-aa68-dbbcbd4403d3)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/spectral-centroid-low.wav' type='audio/mpeg'></audio>

#### Spectral irregularity

Spectral irregularity corresponds to discrepancies in amplitudes between adjacent harmonics. In the following example, adjacent harmonics have relatively similar amplitudes:

![**Tone with high spectral regularity.** (ref:d7c9d179-ae78-45cd-bf4a-94647f9d4603) ](images/spectral-irregularity-regular.svg){width='400px'}

(ref:d7c9d179-ae78-45cd-bf4a-94647f9d4603)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/spectral-irregularity-regular.wav' type='audio/mpeg'></audio>

In this example, the adjacent harmonics have relatively irregular amplitudes. The clarinet and the vibraphone are both examples of instruments with high spectral irregularity.

![**Tone with high spectral irregularity.** (ref:f5976d95-847f-4b13-be86-0aa3005d6aad) ](images/spectral-irregularity-irregular.svg){width='400px'}

(ref:f5976d95-847f-4b13-be86-0aa3005d6aad)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/spectral-irregularity-irregular.wav' type='audio/mpeg'></audio>

#### Nasality

A sound tends to be perceived as nasal when it has a lot of energy in the region spanning from 2000 to 5000 Hz. The following is an example of a tone without much energy in this region:

![**Standard harmonic complex tone.** (ref:a748a721-7444-41b0-80de-6cdd7ffb0efb) ](images/nasality-none.svg){width='400px'}

(ref:a748a721-7444-41b0-80de-6cdd7ffb0efb)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/nasality-none.wav' type='audio/mpeg'></audio>

Now follows a version of the tone where energy has been added in the 2000-5000 Hz region, producing a nasal sound:

![**Harmonic complex tone with energy added in the 2000-5000 Hz region.** (ref:4af0c18c-d293-4105-b0ce-30aa43924878) ](images/nasality-high.svg){width='400px'}

(ref:4af0c18c-d293-4105-b0ce-30aa43924878)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/nasality-high.wav' type='audio/mpeg'></audio>

#### Formants

Formants are a particularly interesting aspect of timbre that determine vowel sounds in speech. A formant corresponds to a peak in the acoustic spectrum located somewhere above the fundamental frequency. The first formants are particularly important for determining vowel identity.

The following example has formants at 850 Hz and 1650 Hz, corresponding to an 'a' vowel.

![**A tone with formants at 850 Hz and 1650 Hz, corresponding to an 'a' vowel.** (ref:b9ab7d6c-ea0a-4d26-811a-0a091371bf49) ](images/formant-a.png){width='400px'}

(ref:b9ab7d6c-ea0a-4d26-811a-0a091371bf49)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/formant-a.wav' type='audio/mpeg'></audio>

The following example has formants at 350 Hz and 650 Hz, corresponding to an 'o' vowel.

![**A tone with formants at 350 Hz and 650 Hz, corresponding to an 'o' vowel.** (ref:062d1ec4-d9bc-4fb4-a186-d6ab60b888bc) ](images/formant-o.png){width='400px'}

(ref:062d1ec4-d9bc-4fb4-a186-d6ab60b888bc)  <audio controls controlsList='nodownload' style='display: block; margin-top: 10px'><source src='audio/formant-o.wav' type='audio/mpeg'></audio>

In human vocalisations, the formant frequencies are determined by the resonances of the vocal tract, which the speaker manipulates in large part through changing the shape and position of the tongue:

![(ref:77a30112-c07f-4688-9c69-1d7d550bc496)  **Four professional musical theatre performers singing vowels in an MRI scanner.** Credit: [ProfEdwardsSU](https://www.youtube.com/channel/UCHuH3XfVqDbK_O-IzLQIeqA), via [YouTube](https://www.youtube.com/watch?v=jaIquq_4560).](images/1x1.png)

(ref:77a30112-c07f-4688-9c69-1d7d550bc496) <iframe width="560" height="315" src="https://www.youtube.com/embed/jaIquq_4560?start=0" style="display: block; margin-bottom: 25px" title="Four professional musical theatre performers singing vowels in an MRI scanner." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Many different vowel sounds can be produced through such manipulations:

![**F1 and F2 frequencies for various vowel sounds.** Credit: [Любослов Езыкин](https://commons.wikimedia.org/wiki/File:Average_vowel_formants_F1_F2.png), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0).](images/formant-frequencies.png){width='400px'}

The 'vocoder' is a technology that enables musicians to incorporate formants (and other speech sounds) into their musical performances in real time. As the performer vocalises into the microphone, a computer extracts the spectral characteristics of their vocalisation and uses it as the timbre for a more traditional musical instrument, for example a keyboard or a guitar. Here's a clip of a vocoder being used in a performance by the band Snarky Puppy:

![(ref:0ae98b0a-9f0c-4bf1-a9fd-295029e451e2)  **'Sleeper' by Snarky Puppy.** Credit: Estival Jazz Lugano, via [YouTube](https://www.youtube.com/watch?v=cHckHVcg7vM).](images/1x1.png)

(ref:0ae98b0a-9f0c-4bf1-a9fd-295029e451e2) <iframe width="560" height="315" src="https://www.youtube.com/embed/cHckHVcg7vM?start=173" style="display: block; margin-bottom: 25px" title="'Sleeper' by Snarky Puppy." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The following applet enables you to explore the spectral content of your own voice. Click on the microphone button (far left) to activate the real-time spectrogram, and try making different kinds of sounds with your voice. Can you differentiate between pitched and non-pitched sounds? Can you identify signature markers of different vowel sounds?

```{=html}
<style>
  #spectrogram-wrapper     {
      height: 500px;
      overflow: hidden;
  }

  #interactive-spectrogram {
      width: 160% !important;
      height: 800px !important;
      -webkit-transform: scale(0.6);
      transform: scale(0.6);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
  }
</style>
```
::: figure
::: {#spectrogram-wrapper}
<iframe id="interactive-spectrogram" src="spectrogram/index.html">

</iframe>
:::

<p class="caption">

<strong>Interactive spectrogram.</strong> Credit: <a href="https://musiclab.chromeexperiments.com">Chrome Music Lab</a>

</p>
:::

