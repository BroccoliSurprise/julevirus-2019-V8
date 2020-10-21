/**
 * Velkommen til den dengang kjempemorsomme julebordsleken "Dødelig  virus mens man jakter på lykken under julebordet." Brukt på julebord på VilVite 2019
 * 
 * Hver spiller fikk hver sin micro;bit, og fikk beskjed om at de skulle gå rundt og samle poeng ved å jakte på hemmelige mandler som lå gjemt i huset. (De sendte signaler over radio med 10-sekunders intervaller).
 * 
 * 1 spiller fikk en versjon av programmet der "PatientZeor" er satt til TRUE. Denne personen begynner å SMITTE andre spillere.
 * 
 * 1 spiller er PatientOmega, som kan gjøre syke pasienter FRISKE (og immune)
 * 
 * 1 micro:bit er MASTER, som kan starte og stoppe spillet.
 * 
 * For ordens skyld ble dette programmet delt opp i mindre deler, slik at det bare var å kopiere filene rett over de ulike micro:bitene.
 * 
 * Spillerne fikk og beskjed om at de fikk poeng av å gå rundt, med det resultat at alle ristet på micro:bitene slik at batteriene løsnet, og micro:biten deres resatte seg (og derfor mistet alle poengene). Dette førte til vill panikk og paranoia, da spillerne antok at de mistet poengene av å ha blitt smittet. De måtte da komme til MASTER-kontrolleren og bli "gjenopplivet".
 */
/**
 * Dette er blokker for virus-delen av spillet.
 */
/**
 * Dette er blokker som brukes av MASTER, fjernkontrollen som starter og stopper spillet.
 */
function bliSmittet () {
    syk = true
    // Når man har blitt smittet, kan man bli kurert i løpet av 10 minutt.
    sykdomTimerSlutt = input.runningTime() + 60000 * 10
    hosteTimer = input.runningTime() + hosteFrekvens
    basic.showIcon(IconNames.Sad)
    if (patientOmega == true) {
        // Omega lager en kur etter 2 minutt
        sykdomTimerSlutt = input.runningTime() + inkubasjonsTid
    } else {
        // Når man har blitt smittet, kan man bli kurert i løpet av 10 minutt.
        sykdomTimerSlutt = input.runningTime() + deathTimer
    }
}
// Denne blokken blir for å finne mandlene i utstillingen.
radio.onReceivedNumber(function (receivedNumber) {
    if (spillStartet == true && MASTER == false) {
        if (radio.receivedPacket(RadioPacketProperty.SignalStrength) >= mandelRadius) {
            mandelListe[receivedNumber] = 1
        }
    }
})
function bliFrisk () {
    syk = false
    immun = true
    hosteTimer = input.runningTime() + hosteFrekvens * 1.5
    score += 10
    basic.showIcon(IconNames.Happy)
}
function stoppSpill () {
    if (spillStartet == true) {
        spillStartet = false
        spillFerdig = true
        for (let value of mandelListe) {
            if (value != 0) {
                mandelScore += 1
            }
        }
        score += mandelScore * 20
        led.stopAnimation()
        basic.showString("Spillet er over!")
        basic.pause(500)
    }
}
function HOST (num: number) {
    if (input.runningTime() >= hosteTimer) {
        hosteTimer = input.runningTime() + num
        radio.sendString("host")
        basic.showLeds(`
            . . # . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
}
function endScreen () {
    if (patientZero == true) {
        basic.showIcon(IconNames.Giraffe)
        basic.pause(500)
    } else if (patientOmega == true) {
        basic.showIcon(IconNames.Fabulous)
        basic.pause(500)
    } else {
    	
    }
    if (immun == true) {
        basic.showIcon(IconNames.Heart)
    } else if (dau == true) {
        basic.showLeds(`
            . # # # .
            # . # . #
            # # # # #
            . # # # .
            . # . # .
            `)
    } else if (syk == true) {
        basic.showIcon(IconNames.Confused)
    } else {
        basic.showIcon(IconNames.Happy)
    }
    basic.showNumber(score)
    basic.pause(1000)
}
input.onButtonPressed(Button.A, function () {
    if (MASTER != true && spillFerdig != true) {
        led.stopAnimation()
        mandelScoreSjekk = 0
        for (let value of mandelListe) {
            if (value != 0) {
                mandelScoreSjekk += 1
            }
        }
        basic.showNumber(mandelScoreSjekk)
    }
})
function statusDisplay () {
    if (input.runningTime() >= statusOppdateringsTimer) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
        statusOppdateringsTimer = input.runningTime() + statusOppdateringFrekvens * 1.05
        basic.showString("I")
        basic.showNumber(antallImmune)
        basic.showString("S")
        basic.showNumber(antallSyke)
        antallImmune = 0
        antallSyke = 0
    } else {
    	
    }
}
function setUpMandel () {
    mandelScore = 0
    mandelScoreSjekk = 0
    // Vi har lagt inn støtte for 7 mandler.
    mandelListe = [0, 0, 0, 0, 0, 0, 0]
}
function startSpill () {
    if (spillStartet == false) {
        spillStartet = true
        if (patientZero == true) {
            basic.showIcon(IconNames.Angry)
            syk = true
            hosteTimer = input.runningTime() + hosteFrekvens
        } else {
            basic.showIcon(IconNames.Yes)
        }
    }
}
input.onButtonPressed(Button.AB, function () {
    if (MASTER == true) {
        radio.setTransmitPower(7)
        radio.sendString("slutt")
        led.stopAnimation()
        basic.showString("STOP")
    } else {
    	
    }
})
function statusKringkasting () {
    if (input.runningTime() >= statusOppdateringsTimer) {
        statusOppdateringsTimer = input.runningTime() + statusOppdateringFrekvens
        if (syk == true) {
            radio.sendString("jegErSyk")
        } else if (immun == true) {
            radio.sendString("jegErImmun")
        } else {
        	
        }
    }
}
// Strings brukes for å starte og stoppe spillet, og spre virus.
radio.onReceivedString(function (receivedString) {
    if (MASTER == true) {
        if (receivedString == "jegErSyk") {
            antallSyke += 1
        } else if (receivedString == "jegErImmun") {
            antallImmune += 1
        } else {
        	
        }
    }
    if (receivedString == "start") {
        startSpill()
    } else if (receivedString == "slutt") {
        stoppSpill()
    } else {
    	
    }
    if (spillStartet == true && MASTER == false) {
        if (immun == false && dau == false) {
            if (radio.receivedPacket(RadioPacketProperty.SignalStrength) >= smitteRadius && (syk == false && receivedString == "host")) {
                bliSmittet()
            } else if (radio.receivedPacket(RadioPacketProperty.SignalStrength) >= smitteRadius && (syk == true && receivedString == "frisk")) {
                bliFrisk()
            } else {
            	
            }
        }
    }
})
input.onButtonPressed(Button.B, function () {
    if (MASTER == true) {
        radio.setTransmitPower(7)
        radio.sendString("start")
    } else if (spillFerdig != true) {
        basic.showNumber(score)
    }
})
// Skritt-teller for spillerne. Jo mer de går, jo flere poeng.
input.onGesture(Gesture.Shake, function () {
    if (spillStartet == true) {
        score += 1
        led.stopAnimation()
    }
})
function nedTellingEtterSmitte () {
    // Patient Zero kan ikke dø
    if (dau == false && patientOmega == true) {
        if (syk == true && input.runningTime() >= sykdomTimerSlutt) {
            basic.showIcon(IconNames.Fabulous)
            bliFrisk()
        } else {
        	
        }
    } else if (dau == false && patientZero == false) {
        if (syk == true && input.runningTime() >= sykdomTimerSlutt) {
            dau = true
            basic.showIcon(IconNames.Skull)
        } else {
        	
        }
    } else {
    	
    }
}
function FRISK (num: number) {
    if (input.runningTime() >= hosteTimer) {
        hosteTimer = input.runningTime() + num
        radio.sendString("frisk")
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
    }
}
/**
 * Endre verdiene i den grønne løkken for å tilpasse spillereglene, og antall mandler i setUpMandel
 */
let antallSyke = 0
let antallImmune = 0
let statusOppdateringsTimer = 0
let mandelScoreSjekk = 0
let mandelScore = 0
let mandelListe: number[] = []
let hosteTimer = 0
let sykdomTimerSlutt = 0
let score = 0
let dau = false
let immun = false
let syk = false
let spillFerdig = false
let spillStartet = false
let deathTimer = 0
let inkubasjonsTid = 0
let statusOppdateringFrekvens = 0
let mandelRadius = 0
let smitteRadius = 0
let hosteFrekvens = 0
let MASTER = false
let patientOmega = false
let patientZero = false
// Her kan du endre på spillereglene
for (let index = 0; index < 1; index++) {
    patientZero = false
    patientOmega = false
    MASTER = false
    // Her kan man sette hvor kjapt smitten skal spre seg.
    hosteFrekvens = randint(10, 15) * 1000
    // Endre dette tallet for å velge hvor nært man må stå for å spre smitten. -69 er ca 30 cm.
    smitteRadius = -69
    // Endre dette tallet for å velge hvor nært man må stå for å spre smitten. -69 er ca 30 cm.
    mandelRadius = -140
    // Denne brukes for at MASTER skal kunne gå rundt og overvåke smitten.
    statusOppdateringFrekvens = 5000
    // Antall minutter som trengs for Omega å lage en kur
    inkubasjonsTid = 2 * 60000
    // Antall minutter viruset trenger på å DREPE deg!
    deathTimer = 10 * 60000
}
radio.setTransmitPower(1)
radio.setGroup(42)
led.setBrightness(20)
spillStartet = false
spillFerdig = false
syk = false
immun = false
dau = false
score = 0
setUpMandel()
basic.forever(function () {
    if (MASTER == true) {
        statusDisplay()
    } else {
        if (spillFerdig == true) {
            endScreen()
        } else if (spillStartet == true) {
            if (syk == true) {
                nedTellingEtterSmitte()
                HOST(hosteFrekvens)
            } else if (immun == true) {
                FRISK(hosteFrekvens * 1.5)
            } else {
            	
            }
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
            statusKringkasting()
        } else {
            basic.showNumber(score)
        }
    }
})
