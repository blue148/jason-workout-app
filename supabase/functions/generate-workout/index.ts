import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Combination, WorkoutRound, Move, WorkoutRequest } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Get available moves from the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: moves, error: movesError } = await supabase
      .from('moves')
      .select('*');

    if (movesError || !moves) {
      throw new Error('Failed to fetch moves');
    }

    const body = await req.json() as WorkoutRequest;
    const { goal, duration, intensity } = body;

    if (!goal || !duration || !intensity) {
      throw new Error('Missing required parameters');
    }

    // Create workout structure
    const roundsCount = Math.floor(duration / 3);
    const rounds: WorkoutRound[] = [];

    for (let i = 1; i <= roundsCount; i++) {
      const combinations: Combination[] = [];
      const combinationCount = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;

      for (let j = 1; j <= combinationCount; j++) {
        const combination = generateCombination(moves, goal, intensity, j);
        combinations.push(combination);
      }

      rounds.push({
        roundNumber: i,
        combinations,
      });
    }

    return new Response(
      JSON.stringify({ rounds }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }), 
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generateCombination(moves: Move[], goal: string, intensity: string, position: number): Combination {
  const id = crypto.randomUUID();
  const selectedMoves = selectMoves(moves, goal, intensity, position);
  
  return {
    id,
    name: `Combination ${position}`,
    moves: selectedMoves.map(move => move.id),
  };
}

function selectMoves(moves: Move[], goal: string, intensity: string, position: number): Move[] {
  const moveCount = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;
  const selectedMoves: Move[] = [];
  
  // Get move categories based on goal
  const punches = moves.filter(m => ['Left Jab', 'Right Cross', 'Left Hook', 'Right Hook'].includes(m.id));
  const kicks = moves.filter(m => ['Left Kick', 'Right Kick', 'Push Kicks'].includes(m.id));
  const knees = moves.filter(m => ['Left Knee', 'Right Knee'].includes(m.id));
  const special = moves.filter(m => ['Pepper Punches', 'Squat'].includes(m.id));
  
  switch (goal.toLowerCase()) {
    case 'cardio':
      selectedMoves.push(...selectCardioMoves(punches, kicks, special, moveCount));
      break;
    case 'power':
      selectedMoves.push(...selectPowerMoves(punches, kicks, knees, moveCount));
      break;
    case 'technique':
      selectedMoves.push(...selectTechniqueMoves(punches, kicks, moveCount));
      break;
    default: // balanced
      selectedMoves.push(...selectBalancedMoves(punches, kicks, knees, special, moveCount));
  }
  
  return selectedMoves;
}

function selectCardioMoves(punches: Move[], kicks: Move[], special: Move[], count: number): Move[] {
  const moves: Move[] = [];
  
  // Always include Pepper Punches for cardio
  const pepperPunches = special.find(m => m.id === 'Pepper Punches');
  if (pepperPunches) moves.push(pepperPunches);
  
  // Add some basic strikes
  while (moves.length < count) {
    moves.push(
      moves.length % 2 === 0
        ? punches[Math.floor(Math.random() * punches.length)]
        : kicks[Math.floor(Math.random() * kicks.length)]
    );
  }
  
  return moves;
}

function selectPowerMoves(punches: Move[], kicks: Move[], knees: Move[], count: number): Move[] {
  const moves: Move[] = [];
  
  // Focus on power strikes
  const powerPunches = punches.filter(m => ['Right Cross', 'Right Hook'].includes(m.id));
  const powerKicks = kicks.filter(m => ['Right Kick'].includes(m.id));
  
  while (moves.length < count) {
    const pool = moves.length % 2 === 0 ? powerPunches : [...powerKicks, ...knees];
    moves.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  
  return moves;
}

function selectTechniqueMoves(punches: Move[], kicks: Move[], count: number): Move[] {
  const moves: Move[] = [];
  
  // Basic combinations for technique focus
  while (moves.length < count) {
    if (moves.length % 2 === 0) {
      // Add punch combination
      moves.push(punches[Math.floor(Math.random() * punches.length)]);
    } else {
      // Add kick
      moves.push(kicks[Math.floor(Math.random() * kicks.length)]);
    }
  }
  
  return moves;
}

function selectBalancedMoves(punches: Move[], kicks: Move[], knees: Move[], special: Move[], count: number): Move[] {
  const moves: Move[] = [];
  const allMoves = [...punches, ...kicks, ...knees, ...special];
  
  while (moves.length < count) {
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    if (!moves.includes(randomMove)) {
      moves.push(randomMove);
    }
  }
  
  return moves;
}