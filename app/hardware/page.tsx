"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Thermometer, 
  Wind, 
  Camera, 
  UserCheck, 
  MapPin, 
  DollarSign,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function HardwarePage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isExpanded = (sectionId: string) => expandedSections[sectionId] || false;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Hardware Requirements</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Complete hardware specifications for Vineyard Temperature, CO₂ & Attendance Monitoring Devices
          </p>
        </div>

        {/* Area Coverage Guidelines */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("area-guidelines")}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-base font-semibold text-foreground">Area Coverage & Scaling Guidelines</p>
              </div>
              {isExpanded("area-guidelines") ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground rotate-[-90deg]" />
              )}
            </div>
            {isExpanded("area-guidelines") && (
              <div className="mt-4 space-y-2 pt-4 border-t border-yellow-500/20">
                <p className="text-sm text-muted-foreground">
                  Temperature does not remain uniform across a vineyard. Sensor count depends on area size, terrain, and microclimate.
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">General Rule of Thumb:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Flat land: 1 sensor per 1–2 acres</li>
                    <li>Sloped / vineyard rows / barrel rooms: 1 sensor per 0.5–1 acre</li>
                    <li>Indoor barrel / fermentation room: 1 sensor per 500–1,000 sq ft</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Temperature Monitoring Devices Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            Temperature Monitoring Devices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option A: Davis Vantage Pro2 */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground">Option A</h3>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Industry Standard</Badge>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("option-a")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Davis Vantage Pro2</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">5-10 acres coverage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">7-10 years lifespan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Cloud API access</span>
                  </div>
                </div>

                {isExpanded("option-a") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost (India):</p>
                      <p className="text-base font-semibold text-foreground">₹55,000 – ₹1,20,000 (one-time)</p>
                      <p className="text-sm text-muted-foreground mt-1">WeatherLink Cloud / API Plan: ₹8,000 – ₹15,000 per year</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <p className="text-sm text-muted-foreground">
                        Enterprise-grade, highly accurate weather and temperature monitoring system used globally in vineyards and farms.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">What It Measures:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Air temperature</li>
                        <li>Relative humidity</li>
                        <li>Wind speed & direction</li>
                        <li>Rainfall</li>
                        <li>Solar radiation (optional)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">How It Works (Data Flow):</p>
                      <p className="text-sm text-muted-foreground">
                        Sensor Suite → Local Console / Gateway → WeatherLink Cloud → ERP / TOAI Dashboard
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Key Features:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Very high sensor accuracy and stability</li>
                        <li>Proven reliability in outdoor agricultural environments</li>
                        <li>Supports both local data logging and cloud-based API access</li>
                        <li>Long hardware lifespan (7–10 years)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Area Coverage:</p>
                      <p className="text-sm text-muted-foreground">
                        Outdoor vineyard: 5 – 10 acres per station (best for macro-climate)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Best For:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Large vineyards</li>
                        <li>Owner / management-level overview</li>
                        <li>Long-term environmental reporting</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Option B: Netatmo Pro Weather Station */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground">Option B</h3>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("option-b")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Netatmo Pro Weather Station</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">2-4 acres coverage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">REST JSON API</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Mobile & Web dashboard</span>
                  </div>
                </div>

                {isExpanded("option-b") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost (India):</p>
                      <p className="text-base font-semibold text-foreground">₹30,000 – ₹60,000</p>
                      <p className="text-sm text-muted-foreground mt-1">Cloud/API Cost: Included (basic)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Wireless temperature and weather monitoring with official APIs.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Features:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>REST JSON API</li>
                        <li>Mobile & Web dashboard</li>
                        <li>Real-time and historical data</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Area Coverage:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Outdoor vineyard: 2–4 acres per unit</li>
                        <li>Indoor storage / barrel room: 1,500–2,500 sq ft</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Best For:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Small to medium vineyards</li>
                        <li>Quick installation</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Option C: Custom IoT Temperature Setup */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground">Option C</h3>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("option-c")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Custom IoT Setup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">0.5-1 acre per node</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">ERP integrated</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Lowest operational cost</span>
                  </div>
                </div>

                {isExpanded("option-c") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost per Node:</p>
                      <p className="text-base font-semibold text-foreground">₹2,000 – ₹6,000</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <p className="text-sm text-muted-foreground mb-1.5">
                        Fully controlled, ERP-integrated temperature monitoring.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Hardware Components:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>ESP32 / Raspberry Pi: ₹600 – ₹2,500</li>
                        <li>Temperature Sensor (DS18B20 / DHT22): ₹150 – ₹400</li>
                        <li>Power supply & casing: ₹300 – ₹800</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Area Coverage (Highly Accurate):</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Outdoor vineyard: 0.5 – 1 acre per node</li>
                        <li>Indoor barrel / fermentation room: 500 – 1,000 sq ft per node</li>
                        <li>Cold storage: 300 – 600 sq ft per node</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Best For:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>ERP + AI analytics</li>
                        <li>Long-term scalability</li>
                        <li>Lowest operational cost</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Other Hardware Devices */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Other Hardware Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CO₂ Filling & Monitoring Devices */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Wind className="w-5 h-5 text-primary" />
                    CO₂ Sensor System
                  </h3>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("co2-sensor")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">MH-Z19 CO₂ Sensor (NDIR)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Range: 0-5000 ppm</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Accuracy: ±50 ppm + 5%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Resistant to alcohol vapors</span>
                  </div>
                </div>

                {isExpanded("co2-sensor") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost per Barrel Zone:</p>
                      <p className="text-base font-semibold text-foreground">₹4,500 – ₹9,000</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Hardware Components:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>MH-Z19 CO₂ Sensor: ₹3,500 – ₹6,000</li>
                        <li>ESP32 Controller: ₹600 – ₹2,500</li>
                        <li>Wiring & enclosure: ₹300 – ₹700</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <p className="text-sm text-muted-foreground">
                        Monitor CO₂ levels during barrel filling and fermentation.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Specifications:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Range: 0 – 5000 ppm</li>
                        <li>Accuracy: ±50 ppm + 5%</li>
                        <li>Resistant to alcohol vapors</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Camera Monitoring System */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    IP Camera System
                  </h3>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("camera-system")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">4-6 IP Cameras (1080p)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">NVR / Cloud Storage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Visual monitoring</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Staff activity verification</span>
                  </div>
                </div>

                {isExpanded("camera-system") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost:</p>
                      <p className="text-base font-semibold text-foreground">₹12,000 – ₹30,000</p>
                      <p className="text-sm text-muted-foreground mt-1">Small Vineyard (4–6 cameras)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Recommended Hardware:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>IP Camera (1080p): ₹1,800 – ₹4,000 per camera</li>
                        <li>NVR / Cloud Storage: ₹3,000 – ₹10,000 (shared)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Visual monitoring of barrel zones</li>
                        <li>Staff activity verification</li>
                        <li>Safety & compliance</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance Management Devices */}
            <Card className="relative border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Biometric System
                  </h3>
                </div>

                <Button 
                  className="w-full mb-4 bg-primary hover:bg-primary/90"
                  onClick={() => toggleSection("attendance-devices")}
                >
                  View Details
                </Button>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Face Recognition</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Fingerprint + Face Combo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Accurate attendance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Prevent proxy entries</span>
                  </div>
                </div>

                {isExpanded("attendance-devices") && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
                    <div className="mb-3 pb-3 border-b border-border/30">
                      <p className="text-sm font-medium text-foreground mb-1.5">Estimated Cost (Per Entry Point):</p>
                      <p className="text-base font-semibold text-foreground">₹10,000 – ₹30,000</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Hardware Options:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Face Recognition Attendance Machine: ₹8,000 – ₹25,000</li>
                        <li>Fingerprint + Face Combo Device: ₹12,000 – ₹30,000</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1.5">Purpose:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Accurate staff attendance</li>
                        <li>Prevent proxy entries</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
