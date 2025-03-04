curationRouter.get(
  "/average-scores",
  asyncHandler(async (req, res) => {
    // 모든 스타일 가져오기 (큐레이팅 포함)
    const styles = await prisma.style.findMany({
      include: {
        curation: {
          select: {
            trendy: true,
            personality: true,
            practicality: true,
            costEffectiveness: true,
          },
        },
      },
    });

    const averageScores = styles.map((style) => {
      const totalCuration = style.curation.length;

      const avgScores = totalCuration
        ? {
            trendy:
              style.curation.reduce((sum, c) => sum + c.trendy, 0) /
              totalCuration,
            personality:
              style.curation.reduce((sum, c) => sum + c.personality, 0) /
              totalCuration,
            practicality:
              style.curation.reduce((sum, c) => sum + c.practicality, 0) /
              totalCuration,
            costEffectiveness:
              style.curation.reduce((sum, c) => sum + c.costEffectiveness, 0) /
              totalCuration,
          }
        : { trendy: 0, personality: 0, practicality: 0, costEffectiveness: 0 };

      return {
        styleId: style.id,
        avgScores,
        total:
          (avgScores.trendy +
            avgScores.personality +
            avgScores.practicality +
            avgScores.costEffectiveness) /
          4,
      };
    });

    res.json(averageScores);
  })
);
