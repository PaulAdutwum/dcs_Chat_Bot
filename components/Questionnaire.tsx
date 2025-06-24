"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

interface CompletedCategories {
  dataScience: boolean;
  criticalDigitalStudies: boolean;
  humanCenteredDesign: boolean;
  communityEngagedLearning: boolean;
}

export default function Questionnaire() {
  const [currentPage, setCurrentPage] = useState("initial");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [previousPage, setPreviousPage] = useState("");
  const [completedCategories, setCompletedCategories] =
    useState<CompletedCategories>({
      dataScience: false,
      criticalDigitalStudies: false,
      humanCenteredDesign: false,
      communityEngagedLearning: false,
    });
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [credits, setCredits] = useState(0);

  const steps = [
    "Introduction",
    "Data Science",
    "Critical Digital Studies",
    "Human-Centered Design",
    "Community Engaged Learning",
    "Summary",
  ];

  const getActiveStep = () => {
    switch (currentPage) {
      case "initial":
        return 0;
      case "dataScience":
        return 1;
      case "criticalDigitalStudies":
        return 2;
      case "humanCenteredDesign":
        return 3;
      case "communityEngagedLearning":
        return 4;
      case "summary":
        return 5;
      default:
        return 0;
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === "yes") {
      setCredits((prev) => prev + 1);
    }

    // Update completed categories
    const category = currentPage as keyof CompletedCategories;
    if (category in completedCategories) {
      setCompletedCategories((prev) => ({
        ...prev,
        [category]: true,
      }));
    }

    // Navigation logic
    setPreviousPage(currentPage);
    switch (currentPage) {
      case "initial":
        setCurrentPage("dataScience");
        break;
      case "dataScience":
        setCurrentPage("criticalDigitalStudies");
        break;
      case "criticalDigitalStudies":
        setCurrentPage("humanCenteredDesign");
        break;
      case "humanCenteredDesign":
        setCurrentPage("communityEngagedLearning");
        break;
      case "communityEngagedLearning":
        setCurrentPage("summary");
        break;
      default:
        break;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      // Here you would typically send the data to your backend
      const response = await fetch("/api/submit-questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          credits,
          selectedChallenges,
          completedCategories,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit questionnaire");
      }

      setEmailSent(true);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      setEmailError("Failed to submit questionnaire. Please try again later.");
    }
  };

  const renderInitialPage = () => (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#881124", fontWeight: "bold" }}
      >
        Welcome to the DCS Major Questionnaire
      </Typography>
      <Typography variant="body1" paragraph>
        This questionnaire will help you understand your progress and interests
        in Digital and Computational Studies at Bates College.
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleAnswer("start")}
        sx={{
          bgcolor: "#881124",
          "&:hover": {
            bgcolor: "#6d0e1d",
          },
        }}
      >
        Start Questionnaire
      </Button>
    </Box>
  );

  const renderDataSciencePage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#881124" }}>
        Data Science Track
      </Typography>
      <Typography variant="body1" paragraph>
        Have you completed any courses in data analysis, statistics, or machine
        learning?
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleAnswer("yes")}
          sx={{ bgcolor: "#881124", "&:hover": { bgcolor: "#6d0e1d" } }}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleAnswer("no")}
          sx={{ color: "#881124", borderColor: "#881124" }}
        >
          No
        </Button>
      </Box>
    </Box>
  );

  const renderCriticalDigitalStudiesPage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#881124" }}>
        Critical Digital Studies
      </Typography>
      <Typography variant="body1" paragraph>
        Have you taken courses exploring the social and cultural impacts of
        technology?
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleAnswer("yes")}
          sx={{ bgcolor: "#881124", "&:hover": { bgcolor: "#6d0e1d" } }}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleAnswer("no")}
          sx={{ color: "#881124", borderColor: "#881124" }}
        >
          No
        </Button>
      </Box>
    </Box>
  );

  const renderHumanCenteredDesignPage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#881124" }}>
        Human-Centered Design
      </Typography>
      <Typography variant="body1" paragraph>
        Have you participated in any user experience or design thinking
        projects?
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleAnswer("yes")}
          sx={{ bgcolor: "#881124", "&:hover": { bgcolor: "#6d0e1d" } }}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleAnswer("no")}
          sx={{ color: "#881124", borderColor: "#881124" }}
        >
          No
        </Button>
      </Box>
    </Box>
  );

  const renderCommunityEngagedLearningPage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#881124" }}>
        Community Engaged Learning
      </Typography>
      <Typography variant="body1" paragraph>
        Have you been involved in any community-based technology projects?
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleAnswer("yes")}
          sx={{ bgcolor: "#881124", "&:hover": { bgcolor: "#6d0e1d" } }}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleAnswer("no")}
          sx={{ color: "#881124", borderColor: "#881124" }}
        >
          No
        </Button>
      </Box>
    </Box>
  );

  const renderSummaryPage = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#881124" }}>
        Summary
      </Typography>
      <Typography variant="body1" paragraph>
        Based on your responses, you have completed {credits} out of 4 major
        areas.
      </Typography>
      <Typography variant="body1" paragraph>
        Enter your email to receive a detailed analysis of your progress:
      </Typography>
      <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: "#881124", "&:hover": { bgcolor: "#6d0e1d" } }}
        >
          Submit
        </Button>
      </Box>
      {emailSent && (
        <Typography variant="body1" sx={{ mt: 2, color: "green" }}>
          Thank you! A summary has been sent to your email.
        </Typography>
      )}
    </Box>
  );

  const getCurrentPageContent = () => {
    switch (currentPage) {
      case "initial":
        return renderInitialPage();
      case "dataScience":
        return renderDataSciencePage();
      case "criticalDigitalStudies":
        return renderCriticalDigitalStudiesPage();
      case "humanCenteredDesign":
        return renderHumanCenteredDesignPage();
      case "communityEngagedLearning":
        return renderCommunityEngagedLearningPage();
      case "summary":
        return renderSummaryPage();
      default:
        return renderInitialPage();
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Stepper activeStep={getActiveStep()} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getCurrentPageContent()}
      </Paper>
    </Container>
  );
}
