/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/
// Frequency fragment shader
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 texCoord;
uniform sampler2D frequencyData;
uniform vec4 foregroundColor;
uniform vec4 backgroundColor;
uniform float yoffset;

void main()
{
    vec4 sample = texture2D(frequencyData, vec2(texCoord.x, yoffset));
    if (texCoord.y > sample.a) {
        // if (texCoord.y > sample.a + 1 || texCoord.y < sample.a - 1) {
        discard;
    }
    float x = texCoord.y / sample.a;
    x = x * x * x;
    gl_FragColor = vec4(1.0); //mix(foregroundColor, backgroundColor, x);
}