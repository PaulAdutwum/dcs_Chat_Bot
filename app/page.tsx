"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  InputBase,
  Breadcrumbs,
  Link,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import type { GridProps } from "@mui/material";
import { ChatWindow } from "@/components/chatbot/ChatWindow";
import Questionnaire from "@/components/Questionnaire";
import Footer from "./components/Footer";

// Search result type
interface SearchResult {
  title: string;
  description: string;
  category: string;
  link: string;
}

// Sample search data - in a real app, this would come from an API or database
const searchData: SearchResult[] = [
  {
    title: "Course Planning",
    description: "Learn about required courses, prerequisites, and recommended course sequences for the DCS major.",
    category: "Academics",
    link: "/academics/course-planning"
  },
  {
    title: "Senior Thesis",
    description: "Information about the DCS senior thesis requirements, timeline, and past examples.",
    category: "Academics",
    link: "/academics/senior-thesis"
  },
  {
    title: "Python Programming",
    description: "Resources for learning Python programming, including course materials and practice exercises.",
    category: "Resources",
    link: "/resources/python"
  },
  {
    title: "Faculty Directory",
    description: "Contact information and research interests of DCS faculty members.",
    category: "People",
    link: "/people/faculty"
  },
  {
    title: "Research Opportunities",
    description: "Current research projects and opportunities for student involvement in DCS.",
    category: "Research",
    link: "/research/opportunities"
  }
];

// Typography styles
const typographyStyles = {
  h1: {
    fontFamily: '"Sabon Next W01", serif',
    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: 'white'
  },
  h2: {
    fontFamily: '"Trade Gothic W01", sans-serif',
    fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
    fontWeight: 400,
    lineHeight: 1.5,
    color: 'white'
  },
  h3: {
    fontFamily: '"Sabon Next W01", serif',
    fontSize: { xs: '2rem', sm: '2.25rem', md: '2.75rem' },
    fontWeight: 500,
    lineHeight: 1.2,
    color: 'var(--colorGarnet)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '2px',
      bgcolor: 'var(--colorGarnet)',
    }
  },
  h4: {
    fontFamily: '"Sabon Next W01", serif',
    fontSize: { xs: '1.5rem', sm: '1.625rem', md: '1.75rem' },
    fontWeight: 500,
    lineHeight: 1.2,
    color: 'var(--colorGarnet)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-12px',
      left: 0,
      width: '40px',
      height: '2px',
      bgcolor: 'var(--colorGarnet)',
    }
  },
  body1: {
    fontFamily: '"Trade Gothic W01", sans-serif',
    fontSize: { xs: '1rem', sm: '1.125rem' },
    lineHeight: 1.7,
    color: 'text.secondary'
  },
  nav: {
    fontFamily: '"Trade Gothic W01", sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    textTransform: 'none'
  }
};

const navItems = [
  { label: "DCS @ Bates", href: "#" },
  { label: "Academics", href: "#" },
  { label: "Mission & Goals", href: "#" },
  { label: "Students", href: "#" },
  { label: "Faculty", href: "#" },
  { label: "Facilities", href: "#" },
];

export default function Home() {
  const [activeComponent, setActiveComponent] = useState<
    "chat" | "questionnaire"
  >("chat");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchDialogOpen(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const results = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleMobileSearch = () => {
    setSearchDialogOpen(true);
  };

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleDrawerToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: '300px',
          bgcolor: 'var(--colorGarnet)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.label}
            onClick={handleDrawerToggle}
            sx={{
              py: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  ...typographyStyles.nav,
                  color: 'white'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const SearchDialog = () => (
    <Dialog
      open={searchDialogOpen}
      onClose={() => setSearchDialogOpen(false)}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: '#fff',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        pb: 2
      }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 1,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search topics, courses, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <IconButton type="submit" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {isSearching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'var(--colorGarnet)' }} />
          </Box>
        ) : searchResults.length > 0 ? (
          <List>
            {searchResults.map((result, index) => (
              <ListItem 
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderColor: 'var(--colorGarnet)',
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={typographyStyles.h4}>
                      {result.title}
                    </Typography>
                    <Chip 
                      label={result.category}
                      size="small"
                      sx={{ 
                        ml: 2,
                        bgcolor: 'var(--colorGarnet)',
                        color: 'white',
                        fontFamily: '"Trade Gothic W01", sans-serif',
                      }}
                    />
                  </Box>
                  <Typography sx={typographyStyles.body1}>
                    {result.description}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : searchQuery && !isSearching ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={typographyStyles.body1}>
              No results found for "{searchQuery}". Try different keywords or browse topics below.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Academics', 'Research', 'Faculty', 'Resources', 'Events'].map((topic) => (
                <Chip 
                  key={topic}
                  label={topic}
                  onClick={() => setSearchQuery(topic)}
                  sx={{ 
                    bgcolor: 'rgba(0,0,0,0.05)',
                    '&:hover': {
                      bgcolor: 'var(--colorGarnet)',
                      color: 'white',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={typographyStyles.body1}>
              Search 
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'  // Ensures footer sticks to bottom
      }}
    >
      <Box sx={{ flex: '1 0 auto' }}> {/* Main content wrapper */}
      {/* Header/Navigation */}
        <AppBar
          position="static"
          sx={{ bgcolor: "var(--colorGarnet)", boxShadow: "none" }}
        >
          <Toolbar sx={{ 
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, md: 1.5 }
          }}>
            <Box
              component="img"
              src="/bates-logo.png"
              alt="Bates College Logo"
              sx={{ 
                height: { xs: 32, md: 40 },
                transition: 'height 0.2s ease'
              }}
            />
            
            {/* Desktop Navigation and Search */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3
              }}
            >
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  color="inherit" 
                  sx={{ 
                    ...typographyStyles.nav,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      bgcolor: 'white',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                      transformOrigin: 'right',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'left',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Search Bar */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 300,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  },
                }}
              >
                <InputBase
                  sx={{ 
                    ml: 1, 
                    flex: 1,
                    color: 'white',
                    '& input::placeholder': {
                      color: 'rgba(255,255,255,0.7)',
                      opacity: 1,
                    },
                  }}
                  placeholder="Search topics, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px', color: 'white' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              alignItems: 'center', 
              gap: 2 
            }}>
              {/* Mobile Search Icon */}
              <IconButton
                color="inherit"
                aria-label="search"
                onClick={handleMobileSearch}
              >
                <SearchIcon />
              </IconButton>
              
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        {mobileMenu}

        {/* Breadcrumb Navigation - Survey/Chatbot Only */}
        {(activeComponent === "chat" || activeComponent === "questionnaire") && (
          <Box 
            sx={{ 
              bgcolor: "#f5f5f5",
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              py: 1.5,
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            <Container maxWidth="lg" sx={{ px: 0 }}>
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                aria-label="breadcrumb"
              >
                <Link
                  underline="hover"
                  color="inherit"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveComponent("chat");
                  }}
                  sx={{
                    ...typographyStyles.nav,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'var(--colorGarnet)',
                    }
                  }}
                >
                  Home
                </Link>
                <Typography 
                  sx={{
                    ...typographyStyles.nav,
                    color: 'var(--colorGarnet)',
                    fontWeight: 500
                  }}
                >
                  {activeComponent === "chat" ? "Chat with DCS Bot" : "DCS Major Survey"}
                </Typography>
              </Breadcrumbs>
            </Container>
          </Box>
        )}

        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            height: { xs: "600px", sm: "550px", md: "500px" },
            backgroundImage:
              "url(https://www.bates.edu/digital-computational-studies/files/2025/06/cropped-digital_2-1.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7))",
            },
          }}
        >
          <Container 
            maxWidth="lg" 
            sx={{ 
              position: "relative", 
              zIndex: 1,
              px: { xs: 3, sm: 4, md: 6 },
              py: { xs: 6, sm: 8, md: 10 },
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                maxWidth: { xs: '100%', sm: '80%', md: '70%' },
                mx: 'auto',
                textAlign: 'center',
                mt: { xs: 4, sm: 5, md: 6 }
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  ...typographyStyles.h1,
                  fontSize: { 
                    xs: '2.25rem', 
                    sm: '2.75rem', 
                    md: '3.25rem', 
                    lg: '3.75rem' 
                  },
                  position: 'relative',
                  display: 'inline-block',
                  mb: { xs: 3, sm: 4 },
                  maxWidth: { xs: '100%', sm: '90%', md: '100%' },
                  mx: 'auto',
                  textAlign: 'center',
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                  '& .second-line': {
                    display: 'block',
                    whiteSpace: { xs: 'normal', sm: 'nowrap' }
                  },
                  '& .mobile-break': {
                    display: { xs: 'block', sm: 'inline' }
                  },
                  '& .at-bates': {
                    display: 'inline-block',
                    marginTop: { xs: '0.2em', sm: 0 }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: '40px', sm: '50px', md: '60px' },
                    height: '3px',
                    background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.3))',
                    transition: 'all 0.3s ease',
                  },
                  '&:hover::after': {
                    width: { xs: '60px', sm: '75px', md: '90px' },
                  },
                  '&:hover': {
                    textShadow: '0 0 30px rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explore Digital and<br />
                <span className="second-line">
                  Computational Studies<span className="mobile-break"> </span>
                  <span className="at-bates">at Bates</span>
                </span>
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  ...typographyStyles.h2,
                  fontSize: { 
                    xs: '1.125rem', 
                    sm: '1.25rem', 
                    md: '1.375rem' 
                  },
                  mb: { xs: 5, sm: 6, md: 7 },
                  maxWidth: { xs: '100%', sm: '90%', md: '80%' },
                  mx: 'auto',
                  lineHeight: 1.6,
                  opacity: 0.9,
                  letterSpacing: '0.01em'
                }}
              >
                Take a guided survey or chat live with our bot.
              </Typography>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2.5, sm: 3 },
                mt: { xs: 3, sm: 4, md: 5 },
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  onClick={() => setActiveComponent("questionnaire")}
                  sx={{
                    bgcolor: "var(--colorGarnet)",
                    ...typographyStyles.nav,
                    py: { xs: 1.75, sm: 2 },
                    px: { xs: 4, sm: 5, md: 6 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    minWidth: { xs: '200px', sm: 'auto' },
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 0,
                      height: 0,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      transition: 'width 0.6s ease, height 0.6s ease',
                      zIndex: -1,
                    },
                    "&:hover": {
                      bgcolor: "var(--colorGarnet)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                      '&::before': {
                        width: '300%',
                        height: '300%',
                      }
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Take the Survey
            </Button>
            <Button
                  variant="outlined"
                  onClick={() => {
                    setActiveComponent("chat");
                    setIsChatOpen(true);
                  }}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    borderWidth: 2,
                    ...typographyStyles.nav,
                    py: { xs: 1.75, sm: 2 },
                    px: { xs: 4, sm: 5, md: 6 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    minWidth: { xs: '200px', sm: 'auto' },
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.5s ease',
                      zIndex: -1,
                    },
                    "&:hover": {
                      borderColor: "white",
                      borderWidth: 2,
                      bgcolor: "transparent",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                      '&::before': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left',
                      }
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Chat with DCS Bot
            </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {activeComponent === "chat" ? (
            <ChatWindow
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          ) : (
            <Questionnaire />
          )}
        </Container>

        {/* How It Works Section */}
        <Box sx={{
          width: '100%',
          bgcolor: '#ffffff',
          py: { xs: 8, md: 12 },
          mt: 0,
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: { xs: 6, md: 8 },
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{
                ...typographyStyles.h3,
                mb: { xs: 4, md: 5 },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--colorGarnet), rgba(136,17,36,0.3))',
                }
              }}>
                Explore DCS Your Way
              </Typography>
              <Typography variant="body1" sx={{ 
                ...typographyStyles.body1, 
                mt: 4, 
                mb: { xs: 6, md: 8 },
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                color: 'text.secondary',
                opacity: 0.9
              }}>
                We've designed two ways to help you learn more about the DCS major — choose the one that works best for you.
              </Typography>
            </Box>
                
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4
            }}>
              <Box sx={{ 
                p: { xs: 4, md: 5 },
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: '#ffffff',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
                  borderColor: 'var(--colorGarnet)',
                }
              }}>
                <Typography variant="h4" sx={typographyStyles.h4}>
                  Take the Survey
                </Typography>
                <Typography variant="body1" sx={{ 
                  ...typographyStyles.body1, 
                  mt: 4,
                  lineHeight: 1.7,
                  color: 'text.secondary'
                }}>
                  Reflect on your interests and explore how the DCS major aligns with your academic goals. Get personalized insights based on your responses.
                </Typography>
              </Box>
              
              <Box sx={{ 
                p: { xs: 4, md: 5 },
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: '#ffffff',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
                  borderColor: 'var(--colorGarnet)',
                }
              }}>
                <Typography variant="h4" sx={typographyStyles.h4}>
                  Chat with DCS Bot
                </Typography>
                <Typography variant="body1" sx={{ 
                  ...typographyStyles.body1, 
                  mt: 4,
                  lineHeight: 1.7,
                  color: 'text.secondary'
                }}>
                  Ask questions about courses, faculty, opportunities, and more. Our AI assistant is here to help you plan your path — in real time.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Search Dialog */}
        <SearchDialog />
      </Box>

      {/* Add Footer */}
      <Footer />
    </Box>
  );
}
