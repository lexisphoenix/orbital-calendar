import datetime
import math

def obtener_estatus_orbital():
    # --- CONSTANTES DEL SISTEMA SOLAR ---
    # Unidades astronómicas y física básica
    AU = 149597870.7  # 1 Unidad Astronómica en km (distancia media)
    EXCENTRICIDAD = 0.0167 # Qué tan "ovalada" es la órbita
    PERIHELIO_DIA = 3 # El día del año que estamos más cerca (aprox 3 de Enero)
    VELOCIDAD_MEDIA = 29.78 # km/s
    
    # --- FECHA ACTUAL ---
    hoy = datetime.date.today()
    dia_del_anib = hoy.timetuple().tm_yday
    
    # --- CÁLCULOS ORBITALES SIMPLIFICADOS ---
    # 1. Calcular anomalía media (dónde estamos en el círculo de 0 a 360)
    # Ajustamos para que 0 sea el Perihelio
    dias_desde_perihelio = dia_del_anib - PERIHELIO_DIA
    if dias_desde_perihelio < 0:
        dias_desde_perihelio += 365
        
    grados_orbitales = (dias_desde_perihelio / 365.25) * 360
    
    # 2. Calcular Distancia (Radio vector) aproximada
    # r = a(1 - e^2) / (1 + e*cos(theta))
    # Simplificación para calendario visual:
    theta_rad = math.radians(grados_orbitales)
    distancia_km = (AU * (1 - EXCENTRICIDAD**2)) / (1 + EXCENTRICIDAD * math.cos(theta_rad))
    
    # 3. Calcular Velocidad (Vis-Viva simplificada)
    # La Tierra va más rápido cuando está cerca (perihelio) y lento cuando está lejos
    velocidad_actual = VELOCIDAD_MEDIA * (AU / distancia_km) # Aproximación visual
    
    # 4. Determinar Fase
    if 0 <= degrees_orbitales < 180:
        fase = "DESACELERANDO (Alejándose del Sol)"
    else:
        fase = "ACELERANDO (Cayendo hacia el Sol)"

    # --- IMPRIMIR LA PÁGINA DEL CALENDARIO ---
    print(f"\n--- REPORTE DE VUELO ORBITAL: TIERRA ---")
    print(f"FECHA HUMANA: {hoy.strftime('%d %b %Y')}")
    print(f"----------------------------------------")
    print(f"📍 POSICIÓN:       {grados_orbitales:.2f}° desde Perihelio")
    print(f"🚀 VELOCIDAD:      {velocidad_actual:.2f} km/s")
    print(f"📏 DISTANCIA SOL:  {distancia_km/1000000:.2f} millones km")
    print(f"🌊 DINÁMICA:       {fase}")
    print(f"----------------------------------------")
    
    # Mensaje contextual
    if velocidad_actual > 30:
        print("NOTA: Estás en el momento de máxima intensidad cinética del año.")
    elif velocidad_actual < 29.4:
        print("NOTA: Momento de calma. Flotando en la parte alta de la órbita.")
    else:
        print("NOTA: Crucero estable.")

# Ejecutar
obtener_estatus_orbital()