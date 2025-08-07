"use client"

import { useState } from "react"
import { X, MapPin, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: number
  name: string
  location: string
  position: string
}

interface LocationsMapProps {
  employees: Employee[]
  onClose: () => void
}

interface LocationData {
  name: string
  count: number
  country: string
  coordinates: { x: number; y: number }
  employees: Employee[]
}

export function LocationsMap({ employees, onClose }: LocationsMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  // Group employees by location and add coordinates
  const locationData: LocationData[] = [
    {
      name: "Tijuana, MX",
      count: employees.filter((emp) => emp.location === "Tijuana, MX").length,
      country: "Mexico",
      coordinates: { x: 120, y: 180 },
      employees: employees.filter((emp) => emp.location === "Tijuana, MX"),
    },
    {
      name: "Culiacán, MX",
      count: employees.filter((emp) => emp.location === "Culiacán, MX").length,
      country: "Mexico",
      coordinates: { x: 140, y: 160 },
      employees: employees.filter((emp) => emp.location === "Culiacán, MX"),
    },
    {
      name: "Guadalajara, MX",
      count: employees.filter((emp) => emp.location === "Guadalajara, MX").length,
      country: "Mexico",
      coordinates: { x: 160, y: 200 },
      employees: employees.filter((emp) => emp.location === "Guadalajara, MX"),
    },
    {
      name: "Colima, MX",
      count: employees.filter((emp) => emp.location === "Colima, MX").length,
      country: "Mexico",
      coordinates: { x: 155, y: 210 },
      employees: employees.filter((emp) => emp.location === "Colima, MX"),
    },
    {
      name: "Aguascalientes, MX",
      count: employees.filter((emp) => emp.location === "Aguascalientes, MX").length,
      country: "Mexico",
      coordinates: { x: 165, y: 190 },
      employees: employees.filter((emp) => emp.location === "Aguascalientes, MX"),
    },
    {
      name: "CDMX, MX",
      count: employees.filter((emp) => emp.location === "CDMX, MX").length,
      country: "Mexico",
      coordinates: { x: 180, y: 210 },
      employees: employees.filter((emp) => emp.location === "CDMX, MX"),
    },
    {
      name: "Medellín, COL",
      count: employees.filter((emp) => emp.location === "Medellín, COL").length,
      country: "Colombia",
      coordinates: { x: 220, y: 320 },
      employees: employees.filter((emp) => emp.location === "Medellín, COL"),
    },
    {
      name: "Cali, COL",
      count: employees.filter((emp) => emp.location === "Cali, COL").length,
      country: "Colombia",
      coordinates: { x: 210, y: 330 },
      employees: employees.filter((emp) => emp.location === "Cali, COL"),
    },
    {
      name: "Bogotá, COL",
      count: employees.filter((emp) => emp.location === "Bogotá, COL").length,
      country: "Colombia",
      coordinates: { x: 230, y: 310 },
      employees: employees.filter((emp) => emp.location === "Bogotá, COL"),
    },
  ].filter((location) => location.count > 0) // Only show locations with employees

  const sortedLocations = [...locationData].sort((a, b) => b.count - a.count)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-arkus-navy">Employee Locations</h2>
            <p className="text-sm text-gray-600">Interactive map showing team distribution</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Map Section */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center relative overflow-hidden">
              {/* Simplified Map SVG */}
              <svg viewBox="0 0 400 500" className="w-full h-full" style={{ maxWidth: "100%", maxHeight: "100%" }}>
                {/* Mexico outline (simplified) */}
                <path
                  d="M80 120 L280 120 L290 140 L300 160 L280 180 L270 200 L250 220 L200 240 L150 230 L120 210 L100 190 L90 170 L80 150 Z"
                  fill="#f3f4f6"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />

                {/* Colombia outline (simplified) */}
                <path
                  d="M180 280 L260 280 L270 300 L280 320 L270 340 L250 360 L220 370 L190 360 L170 340 L160 320 L170 300 Z"
                  fill="#f3f4f6"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />

                {/* Country Labels */}
                <text x="180" y="110" textAnchor="middle" className="text-sm font-medium fill-arkus-navy">
                  MEXICO
                </text>
                <text x="220" y="270" textAnchor="middle" className="text-sm font-medium fill-arkus-navy">
                  COLOMBIA
                </text>

                {/* Location Pins */}
                {locationData.map((location) => (
                  <g key={location.name}>
                    {/* Pin */}
                    <circle
                      cx={location.coordinates.x}
                      cy={location.coordinates.y}
                      r={Math.max(8, Math.min(20, location.count * 2))}
                      fill={selectedLocation === location.name ? "#dc2626" : "#ef4444"}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200 hover:scale-110"
                      onClick={() => setSelectedLocation(location.name)}
                      onMouseEnter={() => setHoveredLocation(location.name)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    />

                    {/* Employee Count Badge */}
                    <text
                      x={location.coordinates.x}
                      y={location.coordinates.y + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {location.count}
                    </text>

                    {/* Location Name on Hover */}
                    {hoveredLocation === location.name && (
                      <g>
                        <rect
                          x={location.coordinates.x - 40}
                          y={location.coordinates.y - 40}
                          width="80"
                          height="20"
                          fill="rgba(0,0,0,0.8)"
                          rx="4"
                        />
                        <text
                          x={location.coordinates.x}
                          y={location.coordinates.y - 26}
                          textAnchor="middle"
                          className="text-xs fill-white font-medium"
                        >
                          {location.name}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                <div className="text-xs font-medium text-arkus-navy mb-2">Legend</div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-3 h-3 bg-arkus-red rounded-full"></div>
                  <span>Office Location</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Size = Employee Count</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-arkus-navy mb-4">Locations Overview</h3>

              {/* Location List */}
              <div className="space-y-3">
                {sortedLocations.map((location) => (
                  <Card
                    key={location.name}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedLocation === location.name
                        ? "ring-2 ring-arkus-red border-arkus-red"
                        : "hover:shadow-md border-gray-200"
                    }`}
                    onClick={() => setSelectedLocation(location.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-arkus-red" />
                          <span className="font-medium text-arkus-navy">{location.name}</span>
                        </div>
                        <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                          {location.country}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {location.count} employee{location.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Location Details */}
              {selectedLocation && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-arkus-navy mb-3">Team Members in {selectedLocation}</h4>
                  <div className="space-y-2">
                    {locationData
                      .find((loc) => loc.name === selectedLocation)
                      ?.employees.map((employee) => (
                        <div key={employee.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-arkus-red rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-arkus-navy">{employee.name}</p>
                            <p className="text-xs text-gray-600">{employee.position}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
