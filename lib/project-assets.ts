import { StaticImageData } from "next/image"

import bitlinks1Img from "../assets/projects/BITLINKS/BITLINKS_1.png"
import bitlinks2Img from "../assets/projects/BITLINKS/BITLINKS_2.png"

import cnc1Img from "../assets/projects/CNC/CNC_1.png"
import cnc2Img from "../assets/projects/CNC/CNC_2.png"
import cnc3Img from "../assets/projects/CNC/CNC_3.png"
import cnc4Img from "../assets/projects/CNC/CNC_4.png"
import cnc5Img from "../assets/projects/CNC/CNC_5.png"
import cnc6Img from "../assets/projects/CNC/CNC_6.png"

import devrank1Img from "../assets/projects/DEVRANK/DEVRANK_1.png"
import devrank2Img from "../assets/projects/DEVRANK/DEVRANK_2.png"
import devrank3Img from "../assets/projects/DEVRANK/DEVRANK_3.png"
import devrank4Img from "../assets/projects/DEVRANK/DEVRANK_4.png"
import devrank5Img from "../assets/projects/DEVRANK/DEVRANK_5.png"
import devrank6Img from "../assets/projects/DEVRANK/DEVRANK_6.png"

import eqrev1Img from "../assets/projects/EQREV/EQREV_1.png"

import progressiq1Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_1.png"
import progressiq2Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_2.png"
import progressiq3Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_3.png"
import progressiq4Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_4.png"
import progressiq5Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_5.png"
import progressiq6Img from "../assets/projects/PROGRESSIQ/PROGRESSIQ_6.png"

const staticProjectMap: Record<string, StaticImageData[]> = {
  CNC: [cnc1Img, cnc2Img, cnc3Img, cnc4Img, cnc5Img, cnc6Img],
  DEVRANK: [devrank1Img, devrank2Img, devrank3Img, devrank4Img, devrank5Img, devrank6Img],
  PROGRESSIQ: [progressiq1Img, progressiq2Img, progressiq3Img, progressiq4Img, progressiq5Img, progressiq6Img],
  BITLINKS: [bitlinks1Img, bitlinks2Img],
  EQREV: [eqrev1Img],
}

function getContext() {
  try {
    // @ts-ignore
    return require.context("../assets/projects", true, /\.(png|jpe?g|webp|svg)$/)
  } catch (e) {
    return null
  }
}

/**
 * Auto-discovers and returns all assets for a given project prefix matching PROJECTNAME_NUMBER format.
 * Example: "CNC" matches CNC_1.png, CNC_2.png, etc.
 * Image _1 is sorted to index 0 as the main image, and remaining images as secondary images.
 */
export function getProjectAssets(projectNamePrefix: string): StaticImageData[] {
  const prefixUpper = projectNamePrefix.toUpperCase().replace(/[-_]/g, "")
  const req = getContext()

  if (req) {
    try {
      const keys: string[] = req.keys()
      const matchedKeys = keys.filter((key) => {
        const filename = key.split("/").pop() || ""
        const filePrefix = filename.split("_")[0]?.toUpperCase().replace(/[-_]/g, "") || ""
        return filePrefix === prefixUpper
      })

      if (matchedKeys.length > 0) {
        matchedKeys.sort((a, b) => {
          const numA = parseInt(a.match(/_(\d+)\./)?.[1] || "0", 10)
          const numB = parseInt(b.match(/_(\d+)\./)?.[1] || "0", 10)
          return numA - numB
        })
        return matchedKeys.map((key) => {
          const mod = req(key)
          return mod.default || mod
        })
      }
    } catch (err) {
      // Fall back to static map
    }
  }

  return staticProjectMap[prefixUpper] || []
}
