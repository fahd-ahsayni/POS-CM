<Drawer open={open} setOpen={setOpen} title="Open Shift">

<TypographyP className="text-sm">
  Enter the admin passcode or scan an admin badge to proceed with the
  cancellation.
</TypographyP>
  <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
    <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
    <CirclesAnimation
      currentLength={passcode.length}
      incorrectPasscode={incorrectPasscode}
    />
      <div>
      <NumberPad
      onNumberClick={handleNumberClick}
      numbers={shuffledNumbers}
      fixLightDark
    />
      </div>
    </div>
    <div className="flex gap-4 mt-6 w-full px-8">
    <ShineBorder
      className={cn(
        "flex cursor-pointer justify-center items-center gap-4 py-3 px-8"
      )}
      color="#fff"
      borderWidth={2}
    >
      <RiRfidFill size={20} className={cn("text-white")} />
      Scan Admin Badge
    </ShineBorder>
    </div>
  </section>
</Drawer>;


<div className="flex flex-col gap-2 h-full py-8">

<div className="h-full flex flex-col justify-center items-center">
  <div className="">
    <CirclesAnimation
      currentLength={passcode.length}
      incorrectPasscode={incorrectPasscode}
    />
  </div>
  <div className="mt-10 min-w-full px-20">
    <NumberPad
      onNumberClick={handleNumberClick}
      numbers={shuffledNumbers}
      fixLightDark
    />
  </div>
</div>
<div>
  <div className="flex justify-center items-center mt-6">
    <ShineBorder
      className={cn(
        "flex cursor-pointer justify-center items-center gap-4 py-3 px-8"
      )}
      color="#fff"
      borderWidth={2}
    >
      <RiRfidFill size={20} className={cn("text-white")} />
      Scan Admin Badge
    </ShineBorder>
  </div>
</div>
</div>