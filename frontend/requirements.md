## Packages
react-webcam | Capture images for face recognition
framer-motion | Complex animations for the scanning UI
lucide-react | Iconography
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
Integration with backend Routes:
- POST /api/auth/register (requires 3 images: center, left, right)
- POST /api/auth/face-login (requires 1 image)
- GET /api/user/me (auth check)

Font Strategy:
- Orbitron for headers (Cyberpunk feel)
- Rajdhani for body text (Tech feel)
- JetBrains Mono for data/console output
