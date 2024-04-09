import numpy as np
from scipy.optimize import fsolve
from math import log10

# Gegeven waarden
h = [0, 1, 1, 0]  # x-coördinaten van de centra
k = [0, 0, 1, 1]  # y-coördinaten van de centra
l = [0, 0, 0, 0]  # z-coördinaten van de centra
S = [-80, -82, -81, -79]  # Signaalsterktes in dBm
N = 3  # Dempingsfactor

# Vergelijkingen definiëren als functie
def equations(vars):
    x, y, z, P = vars
    equations = []
    for i in range(4):
        ri = 10**((P - S[i]) / (10 * N))
        if i == 3:
            # Vergelijking voor P uitdrukken via de vijfde bol
            P_expected = 5 * N * log10((x-h[3])**2 + (y-k[3])**2 + (z-l[3])**2) + S[3]
            equations.append(P - P_expected)
        else:
            # Vergelijkingen voor elke bol
            equation = (x - h[i])**2 + (y - k[i])**2 + (z - l[i])**2 - ri**2
            equations.append(equation)
    return equations

# Initiële schattingen voor x, y, z, P
initial_guess = [1, 1, 1, -70]  # Aannames gebaseerd op gemiddelde waarden of eerdere metingen

# Oplossing vinden met fsolve
solution = fsolve(equations, initial_guess)
print("De oplossing is: X = {:.2f}, Y = {:.2f}, Z = {:.2f}, P = {:.2f}".format(*solution))
