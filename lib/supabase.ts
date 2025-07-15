// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jhramukssvhiicxevzjq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocmFtdWtzc3ZoaWljeGV2empxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Nzc5NjIsImV4cCI6MjA2NzU1Mzk2Mn0.HYhqwuHxr7sNyEiXREnHI94OXnFAu4jiFL8UyBxwJZg"; // înlocuiește cu cheia ta

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
