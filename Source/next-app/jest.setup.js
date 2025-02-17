import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { jest } from "@jest/globals";

// Enable fetch mocking
fetchMock.enableMocks();

// Mock Next.js router
jest.mock("next/navigation", () => require("next-router-mock"));
