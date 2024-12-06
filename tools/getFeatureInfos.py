import requests
import json

features = [
    "Hochwassergefahrenkarte",
    "Klimaanpassungsmassnahmen",
    "Laermkarten_Vektor",
    "Schutzgebiete",
    "Fernwaermeleitungsnetz",
    "Bebauungsplan",
    "NVK_FNP_Flaechen",
    "Bodenrichtwerte"
    ]

baseaddr = "https://geoportal.karlsruhe.de/ags04/rest/services/Hosted"

def mkUrl(feature):
    return f"{baseaddr}/{feature}/FeatureServer/"


for f in features:
    url = mkUrl(f) + "?f=json"
    r = requests.get(url)
    if r.status_code != 200:
        print("failed:",f, r.status_code,url)
        continue

    data = r.json()
    with open(f"{f}.json","w") as fl:
        json.dump(data,fl)
            
    layers = [l for l in data["layers"]]
    for l in layers:
        layer = l["id"]
        url = mkUrl(f) + str(layer) + "/?f=json"
        r = requests.get(url)
        if r.status_code != 200:
            print("failed:", f, layer, r.status_code,url)
            continue

        data = r.json()
        with open(f"{f}_{layer}.json","w") as fl:
            json.dump(data,fl)
    
