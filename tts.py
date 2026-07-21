import cowsay
import pyttsx3

engine=psttx3.init()
this= input("Enter text:")
cowsay.cow(this)
engine.say(this)
engine.runAndWait()