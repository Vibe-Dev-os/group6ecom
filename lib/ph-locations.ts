// Philippine Locations Data - Region IX (Zamboanga Peninsula)
export interface Location {
  code: string
  name: string
}

export interface City extends Location {
  municipalities: Municipality[]
}

export interface Municipality extends Location {
  barangays: string[]
}

export interface Region extends Location {
  cities: City[]
}

// Region IX - Zamboanga Peninsula Data
export const regionIXData: Region = {
  code: "IX",
  name: "Region IX - Zamboanga Peninsula",
  cities: [
    {
      code: "ZAM_CITY",
      name: "Zamboanga City",
      municipalities: [
        {
          code: "ZAM_CITY_PROPER",
          name: "Zamboanga City Proper",
          barangays: [
            "Ayala",
            "Baliwasan",
            "Boalan",
            "Bolong",
            "Buenavista",
            "Bunguiao",
            "Busay",
            "Cabaluay",
            "Cabatangan",
            "Cacao",
            "Calabasa",
            "Calarian",
            "Camino Nuevo",
            "Campo Islam",
            "Canelar",
            "Capisan",
            "Cawit",
            "Culianan",
            "Curuan",
            "Divisoria",
            "Dulian",
            "Guiwan",
            "Kasanyangan",
            "La Paz",
            "Landang Gua",
            "Landang Laum",
            "Lanzones",
            "Latuan",
            "Licomo",
            "Limaong",
            "Limpapa",
            "Lubigan",
            "Lumayang",
            "Lumbangan",
            "Lunzuran",
            "Maasin",
            "Malagutay",
            "Mampang",
            "Manalipa",
            "Manicahan",
            "Mariki",
            "Mercedes",
            "Muti",
            "Pamucutan",
            "Pangapuyan",
            "Panubigan",
            "Pasilmanta",
            "Pasobolong",
            "Pasonanca",
            "Patalon",
            "Putik",
            "Quiniput",
            "Recodo",
            "Rio Hondo",
            "Salaan",
            "San Jose Cawa-cawa",
            "San Jose Gusu",
            "San Roque",
            "Sangali",
            "Santa Barbara",
            "Santa Catalina",
            "Santa Maria",
            "Santo Niño",
            "Sibulao",
            "Sinubung",
            "Sinunuc",
            "Tagasilay",
            "Talabaan",
            "Talisayan",
            "Taluksangay",
            "Tetuan",
            "Tictapul",
            "Tigbalabag",
            "Tigtabon",
            "Tolosa",
            "Tugbungan",
            "Tulungatung",
            "Tumaga",
            "Tumalutab",
            "Tumitus",
            "Victoria",
            "Vitali",
            "Yulo",
            "Zambowood"
          ]
        }
      ]
    },
    {
      code: "ZAM_DEL_NORTE",
      name: "Zamboanga del Norte",
      municipalities: [
        {
          code: "DAPITAN",
          name: "Dapitan City",
          barangays: [
            "Aliguay",
            "Ba-ao",
            "Bagting",
            "Banbanan",
            "Barcelona",
            "Baylimango",
            "Burgos",
            "Carang",
            "Cawa-cawa",
            "Dampalan",
            "Dapitan",
            "Diwa-an",
            "Guimputlan",
            "Hilltop",
            "Ilaya",
            "Linabo",
            "Masidlakon",
            "Matagobtob",
            "Napo",
            "Opao",
            "Oro",
            "Potol",
            "Sabang",
            "San Nicolas",
            "San Pedro",
            "San Vicente",
            "Santa Cruz",
            "Sibutad",
            "Sulangon",
            "Taguilon",
            "Talisay",
            "Tamion",
            "Tanawan",
            "Tiguma",
            "Villa Real"
          ]
        },
        {
          code: "DIPOLOG",
          name: "Dipolog City",
          barangays: [
            "Barra",
            "Biasong",
            "Binuangan",
            "Central",
            "Cogon",
            "Diwan",
            "Estaka",
            "Galas",
            "Gulayon",
            "Lugdungan",
            "Miputak",
            "Olingan",
            "Pansur",
            "Polanco",
            "Santa Isabel",
            "Sicayab",
            "Sinaman",
            "Turno"
          ]
        },
        {
          code: "SINDANGAN",
          name: "Sindangan",
          barangays: [
            "Bagong Tudela",
            "Balok",
            "Bolitoc",
            "Goleo",
            "Kauswagan",
            "Labason",
            "Lourdes",
            "Magsaysay",
            "New Panay",
            "Poblacion",
            "Rosario",
            "San Isidro",
            "San Jose",
            "Sinonoc",
            "Tubigan"
          ]
        }
      ]
    },
    {
      code: "ZAM_DEL_SUR",
      name: "Zamboanga del Sur",
      municipalities: [
        {
          code: "PAGADIAN",
          name: "Pagadian City",
          barangays: [
            "Alegria",
            "Balangasan",
            "Baloyboan",
            "Banale",
            "Bogo",
            "Bomba",
            "Buenavista",
            "Bulatok",
            "Bunawan",
            "Dao",
            "Datagan",
            "Dumagoc",
            "Gatas",
            "Gubac",
            "Kagawasan",
            "Kawit",
            "Lenienza",
            "Lizon Valley",
            "Lower Sibatang",
            "Lumad",
            "Macasing",
            "Napolan",
            "Palpalan",
            "Poblacion",
            "San Francisco",
            "San Pedro",
            "Santa Lucia",
            "Santa Maria",
            "Santiago",
            "Tiguma",
            "Tiguha",
            "Tuburan",
            "Tulangan",
            "Upper Sibatang",
            "White Beach"
          ]
        },
        {
          code: "AURORA",
          name: "Aurora",
          barangays: [
            "Acad",
            "Alang-alang",
            "Alegria",
            "Anonang",
            "Bagong Mandaue",
            "Bagong Maslog",
            "Bagong Oslob",
            "Bagong Pitogo",
            "Baki",
            "Balas",
            "Balide",
            "Balintawak",
            "Bayabas",
            "Bemposa",
            "Cabilinan",
            "Campo Uno",
            "Ceboneg",
            "Commonwealth",
            "Gubaan",
            "Inasagan",
            "Inroad",
            "Kahayagan East (Katipunan)",
            "Kahayagan West",
            "Kauswagan",
            "La Paz (Tinibtiban)",
            "La Victoria",
            "Lantungan",
            "Libertad",
            "Lintugop",
            "Lubid",
            "Maguikay",
            "Mahayahay",
            "Monte Alegre",
            "Montela",
            "Napo",
            "Panaghiusa",
            "Poblacion",
            "Resthouse",
            "Romarate",
            "San Jose",
            "San Juan",
            "Sapa Loboc",
            "Tagulalo",
            "Waterfall"
          ]
        }
      ]
    },
    {
      code: "ZAM_SIBUGAY",
      name: "Zamboanga Sibugay",
      municipalities: [
        {
          code: "IPIL",
          name: "Ipil",
          barangays: [
            "Balas",
            "Balong-balong",
            "Bangkerohan",
            "Buluan",
            "Cebongan",
            "Imelda",
            "Kapok",
            "Keytodac",
            "Lourdes",
            "Makilas",
            "Poblacion",
            "Rosario",
            "San Jose",
            "Tenan",
            "Titay"
          ]
        },
        {
          code: "KABASALAN",
          name: "Kabasalan",
          barangays: [
            "Bagumbayan",
            "Balabawan",
            "Balok-balok",
            "Datu Balong",
            "Dinas",
            "Guipos",
            "Lumbog",
            "Malindang",
            "Poblacion",
            "Salug",
            "Sandayong",
            "Tigbao"
          ]
        }
      ]
    }
  ]
}

// Helper functions for location data
export const getCitiesByRegion = (regionCode: string): City[] => {
  if (regionCode === "IX") {
    return regionIXData.cities
  }
  return []
}

export const getMunicipalitiesByCity = (cityCode: string): Municipality[] => {
  const city = regionIXData.cities.find(c => c.code === cityCode)
  return city ? city.municipalities : []
}

export const getBarangaysByMunicipality = (municipalityCode: string): string[] => {
  for (const city of regionIXData.cities) {
    const municipality = city.municipalities.find(m => m.code === municipalityCode)
    if (municipality) {
      return municipality.barangays
    }
  }
  return []
}

export const getAllRegions = (): Region[] => {
  return [regionIXData]
}
