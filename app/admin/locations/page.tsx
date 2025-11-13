"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  getAllRegions, 
  getCitiesByRegion, 
  getMunicipalitiesByCity, 
  getBarangaysByMunicipality,
  type Region,
  type City,
  type Municipality
} from "@/lib/ph-locations"
import { MapPin, Building, Home, Globe } from "lucide-react"

export default function LocationsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("")
  const [selectedBarangay, setSelectedBarangay] = useState<string>("")
  
  const [availableRegions] = useState<Region[]>(getAllRegions())
  const [availableCities, setAvailableCities] = useState<City[]>([])
  const [availableMunicipalities, setAvailableMunicipalities] = useState<Municipality[]>([])
  const [availableBarangays, setAvailableBarangays] = useState<string[]>([])

  // Handle region selection
  const handleRegionChange = (regionCode: string) => {
    setSelectedRegion(regionCode)
    const cities = getCitiesByRegion(regionCode)
    setAvailableCities(cities)
    setSelectedCity("")
    setSelectedMunicipality("")
    setSelectedBarangay("")
    setAvailableMunicipalities([])
    setAvailableBarangays([])
  }

  // Handle city selection
  const handleCityChange = (cityCode: string) => {
    setSelectedCity(cityCode)
    const municipalities = getMunicipalitiesByCity(cityCode)
    setAvailableMunicipalities(municipalities)
    setSelectedMunicipality("")
    setSelectedBarangay("")
    setAvailableBarangays([])
  }

  // Handle municipality selection
  const handleMunicipalityChange = (municipalityCode: string) => {
    setSelectedMunicipality(municipalityCode)
    const barangays = getBarangaysByMunicipality(municipalityCode)
    setAvailableBarangays(barangays)
    setSelectedBarangay("")
  }

  // Get selected names for display
  const getSelectedNames = () => {
    const region = availableRegions.find(r => r.code === selectedRegion)
    const city = availableCities.find(c => c.code === selectedCity)
    const municipality = availableMunicipalities.find(m => m.code === selectedMunicipality)
    
    return {
      regionName: region?.name || "",
      cityName: city?.name || "",
      municipalityName: municipality?.name || "",
      barangayName: selectedBarangay
    }
  }

  const selectedNames = getSelectedNames()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
        <p className="text-muted-foreground">
          Manage Philippine administrative divisions and location data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Location Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Selector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Region Selection */}
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {availableRegions.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <Label htmlFor="city">City/Province</Label>
              <Select 
                value={selectedCity} 
                onValueChange={handleCityChange}
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City/Province" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Municipality Selection */}
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality</Label>
              <Select 
                value={selectedMunicipality} 
                onValueChange={handleMunicipalityChange}
                disabled={!selectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Municipality" />
                </SelectTrigger>
                <SelectContent>
                  {availableMunicipalities.map((municipality) => (
                    <SelectItem key={municipality.code} value={municipality.code}>
                      {municipality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Barangay Selection */}
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              <Select 
                value={selectedBarangay} 
                onValueChange={setSelectedBarangay}
                disabled={!selectedMunicipality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Barangay" />
                </SelectTrigger>
                <SelectContent>
                  {availableBarangays.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selected Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRegion ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Region:</span>
                  <Badge variant="secondary">{selectedNames.regionName}</Badge>
                </div>
                
                {selectedCity && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-500" />
                    <span className="font-medium">City/Province:</span>
                    <Badge variant="secondary">{selectedNames.cityName}</Badge>
                  </div>
                )}
                
                {selectedMunicipality && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Municipality:</span>
                    <Badge variant="secondary">{selectedNames.municipalityName}</Badge>
                  </div>
                )}
                
                {selectedBarangay && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Barangay:</span>
                    <Badge variant="secondary">{selectedNames.barangayName}</Badge>
                  </div>
                )}

                {selectedBarangay && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Complete Address:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedNames.barangayName}, {selectedNames.municipalityName}, {selectedNames.cityName}, {selectedNames.regionName}, Philippines
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a region to view location details
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{availableRegions.length}</p>
                <p className="text-sm text-muted-foreground">Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {availableRegions.reduce((total, region) => total + region.cities.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Cities/Provinces</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {availableRegions.reduce((total, region) => 
                    total + region.cities.reduce((cityTotal, city) => 
                      cityTotal + city.municipalities.length, 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Municipalities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {availableRegions.reduce((total, region) => 
                    total + region.cities.reduce((cityTotal, city) => 
                      cityTotal + city.municipalities.reduce((munTotal, municipality) => 
                        munTotal + municipality.barangays.length, 0), 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Barangays</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
