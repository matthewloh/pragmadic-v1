"use client"
import * as React from "react"
import { useState } from "react"
import { useControl, Marker, MarkerProps, ControlPosition } from "react-map-gl"
import MapboxGeocoder, { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder"

type GeocoderControlProps = Omit<
    GeocoderOptions,
    "accessToken" | "mapboxgl" | "marker"
> & {
    mapboxAccessToken: string
    marker?: boolean | Omit<MarkerProps, "longitude" | "latitude">
    position: ControlPosition
    onLoading?: (e: object) => void
    onResults?: (e: object) => void
    onResult?: (e: object) => void
    onError?: (e: object) => void
}

export default function GeocoderControl(props: GeocoderControlProps) {
    const [marker, setMarker] = useState<React.ReactElement | null>(null)

    const geocoder = useControl<any>(
        () => {
            const ctrl = new MapboxGeocoder({
                ...props,
                marker: false,
                accessToken: props.mapboxAccessToken,
            })
            if (props.onLoading) ctrl.on("loading", props.onLoading)
            if (props.onResults) ctrl.on("results", props.onResults)
            ctrl.on("result", (evt: any) => {
                props.onResult?.(evt)

                const { result } = evt
                const location =
                    result &&
                    (result.center ||
                        (result.geometry?.type === "Point" &&
                            result.geometry.coordinates))
                if (location && props.marker) {
                    setMarker(
                        <Marker
                            {...(props.marker === true ? {} : props.marker)}
                            longitude={location[0]}
                            latitude={location[1]}
                        />,
                    )
                } else {
                    setMarker(null)
                }
            })
            if (props.onError) ctrl.on("error", props.onError)
            return ctrl
        },
        {
            position: props.position,
        },
    )

    // Update geocoder options when props change
    React.useEffect(() => {
        if (!geocoder) {
            return
        }
        if (props.zoom) geocoder.setZoom(props.zoom)
        if (props.flyTo) geocoder.setFlyTo(props.flyTo)
        if (props.placeholder) geocoder.setPlaceholder(props.placeholder)
        if (props.proximity) geocoder.setProximity(props.proximity)
        if (props.bbox) geocoder.setBbox(props.bbox)
        if (props.countries) geocoder.setCountries(props.countries)
        if (props.types) geocoder.setTypes(props.types)
        if (props.minLength) geocoder.setMinLength(props.minLength)
        if (props.limit) geocoder.setLimit(props.limit)
        if (props.language) geocoder.setLanguage(props.language)
        if (props.filter) geocoder.setFilter(props.filter)
        if (props.origin) geocoder.setOrigin(props.origin)
    }, [
        geocoder,
        props.zoom,
        props.flyTo,
        props.placeholder,
        props.proximity,
        props.bbox,
        props.countries,
        props.types,
        props.minLength,
        props.limit,
        props.language,
        props.filter,
        props.origin,
    ])

    return marker
}
