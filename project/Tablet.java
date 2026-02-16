package project;

import java.util.List;

public class Tablet {
    public final List<String> threadColors;

    public Tablet(List<String> threadColors) {
        this.threadColors = threadColors;
    }

    public int getThreadCount() {
        return threadColors.size();
    }
}