import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// deconstructed to prevent calling config.env.imagekit.* for every parameter
// being passed to ImageKit
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
