"use client";

import { Box, Container, Typography, Link, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const footerLinks = {
  quickLinks: [
    { text: "Make a Gift", href: "https://www.bates.edu/give" },
    { text: "Campus Safety", href: "https://www.bates.edu/security" },
    { text: "Communications", href: "https://www.bates.edu/communications" },
    { text: "Directory", href: "https://www.bates.edu/directory" },
    { text: "Employment", href: "https://www.bates.edu/employment" },
  ],
  policies: [
    {
      text: "Sexual Respect / Title IX",
      href: "https://www.bates.edu/sexual-respect",
    },
    { text: "A-Z Index", href: "https://www.bates.edu/a-z" },
    { text: "Privacy Policy", href: "https://www.bates.edu/privacy" },
    { text: "Questions & Feedback", href: "https://www.bates.edu/feedback" },
    { text: "Virtual Tour", href: "https://www.bates.edu/virtual-tour" },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "white",
        py: { xs: 6, md: 8 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 4,
          }}
        >
          {/* Contact Information */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Trade Gothic W01", sans-serif',
                fontSize: "1.25rem",
                mb: 3,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.3px",
                position: "relative",
                paddingBottom: "12px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #fff, rgba(255,255,255,0.3))",
                },
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <LocationOnIcon sx={{ color: "var(--colorGarnet)" }} />
                <Typography variant="body2">
                  Bates College
                  <br />
                  2 Andrews Road
                  <br />
                  Lewiston, Maine 04240
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <PhoneIcon sx={{ color: "var(--colorGarnet)" }} />
                <Link
                  href="tel:1-207-786-6255"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  1-207-786-6255
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Trade Gothic W01", sans-serif',
                fontSize: "1.25rem",
                mb: 3,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.3px",
                position: "relative",
                paddingBottom: "12px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #fff, rgba(255,255,255,0.3))",
                },
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.quickLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Policies */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Trade Gothic W01", sans-serif',
                fontSize: "1.25rem",
                mb: 3,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.3px",
                position: "relative",
                paddingBottom: "12px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #fff, rgba(255,255,255,0.3))",
                },
              }}
            >
              Policies & Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.policies.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2,
          }}
        >
          <Box
            component="img"
            src="/images/bates-logo-white.png"
            alt="Bates College Logo"
            sx={{ height: 40 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              textAlign: { xs: "center", sm: "right" },
            }}
          >
            © {new Date().getFullYear()} Bates College. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
