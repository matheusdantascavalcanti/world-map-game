import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const WorldMap: React.FC = () => {
  const chartRef = useRef<am4maps.MapChart | null>(null);

  useEffect(() => {
    // Create map instance
    const chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    // Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#74B266");

    // Add hover state
    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    // Add click event to countries
    polygonTemplate.events.on("hit", (ev: any) => {
      const countryName = ev.target.dataItem.dataContext.name;
      alert(`Clicked on: ${countryName}`);
    });

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "100%" }} />;
};

export default WorldMap;
